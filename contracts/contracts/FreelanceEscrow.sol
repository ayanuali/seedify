// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// handles escrow for freelance payments
// funds locked until ai approves work or dispute resolves
contract FreelanceEscrow is ReentrancyGuard {

    IERC20 public usdcToken;
    address public platform;
    uint256 public platformFeePercent = 200; // 2% in basis points

    enum JobStatus {
        Active,      // funds locked, work in progress
        Submitted,   // freelancer submitted, waiting verification
        Completed,   // ai approved, payment released
        Disputed,    // client or ai flagged issue
        Cancelled    // refunded to client
    }

    struct Job {
        address client;
        address freelancer;
        uint256 amount;
        uint256 createdAt;
        JobStatus status;
        string workUrl;  // ipfs hash of deliverables
        bool clientApproved;
        bool aiApproved;
    }

    mapping(uint256 => Job) public jobs;
    uint256 public jobCounter;

    event JobCreated(uint256 indexed jobId, address client, address freelancer, uint256 amount);
    event WorkSubmitted(uint256 indexed jobId, string workUrl);
    event JobCompleted(uint256 indexed jobId);
    event JobDisputed(uint256 indexed jobId);
    event JobCancelled(uint256 indexed jobId);

    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
        platform = msg.sender;
    }

    // client creates job and locks funds
    function createJob(
        address _freelancer,
        uint256 _amount
    ) external nonReentrant returns (uint256) {
        require(_amount > 0, "amount must be positive");
        require(_freelancer != address(0), "invalid freelancer address");
        require(_freelancer != msg.sender, "cant hire yourself");

        // transfer usdc from client to contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "usdc transfer failed"
        );

        uint256 jobId = jobCounter++;
        jobs[jobId] = Job({
            client: msg.sender,
            freelancer: _freelancer,
            amount: _amount,
            createdAt: block.timestamp,
            status: JobStatus.Active,
            workUrl: "",
            clientApproved: false,
            aiApproved: false
        });

        emit JobCreated(jobId, msg.sender, _freelancer, _amount);
        return jobId;
    }

    // freelancer submits completed work
    function submitWork(uint256 _jobId, string memory _workUrl) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.freelancer, "only freelancer can submit");
        require(job.status == JobStatus.Active, "job not active");
        require(bytes(_workUrl).length > 0, "work url required");

        job.status = JobStatus.Submitted;
        job.workUrl = _workUrl;

        emit WorkSubmitted(_jobId, _workUrl);
    }

    // ai verification result from backend
    // only platform can call this after ai checks work
    function setAIApproval(uint256 _jobId, bool _approved) external {
        require(msg.sender == platform, "only platform");
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Submitted, "not submitted");

        job.aiApproved = _approved;

        // if ai approved and client didnt dispute, auto-complete
        if (_approved) {
            _completeJob(_jobId);
        }
    }

    // client manually approves (overrides ai if needed)
    function approveWork(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client, "only client");
        require(job.status == JobStatus.Submitted, "not submitted");

        job.clientApproved = true;
        _completeJob(_jobId);
    }

    // client or platform can dispute
    function disputeJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(
            msg.sender == job.client || msg.sender == platform,
            "not authorized"
        );
        require(
            job.status == JobStatus.Submitted || job.status == JobStatus.Active,
            "cant dispute completed job"
        );

        job.status = JobStatus.Disputed;
        emit JobDisputed(_jobId);
    }

    // resolve dispute - platform decides split
    // for mvp we do manual resolution, later add voting or arbitration
    function resolveDispute(
        uint256 _jobId,
        uint256 _clientPercent  // 0-100, rest goes to freelancer
    ) external {
        require(msg.sender == platform, "only platform");
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Disputed, "not disputed");
        require(_clientPercent <= 100, "invalid percent");

        uint256 platformFee = (job.amount * platformFeePercent) / 10000;
        uint256 remaining = job.amount - platformFee;

        uint256 clientAmount = (remaining * _clientPercent) / 100;
        uint256 freelancerAmount = remaining - clientAmount;

        if (clientAmount > 0) {
            usdcToken.transfer(job.client, clientAmount);
        }
        if (freelancerAmount > 0) {
            usdcToken.transfer(job.freelancer, freelancerAmount);
        }
        usdcToken.transfer(platform, platformFee);

        job.status = JobStatus.Completed;
        emit JobCompleted(_jobId);
    }

    // internal function to release payment
    function _completeJob(uint256 _jobId) private {
        Job storage job = jobs[_jobId];

        uint256 platformFee = (job.amount * platformFeePercent) / 10000;
        uint256 freelancerAmount = job.amount - platformFee;

        require(usdcToken.transfer(job.freelancer, freelancerAmount), "freelancer payment failed");
        require(usdcToken.transfer(platform, platformFee), "platform fee failed");

        job.status = JobStatus.Completed;
        emit JobCompleted(_jobId);
    }

    // cancel job if work never started
    // only before work submitted
    function cancelJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client, "only client");
        require(job.status == JobStatus.Active, "cant cancel after submission");
        require(block.timestamp < job.createdAt + 24 hours, "too late to cancel");

        job.status = JobStatus.Cancelled;
        require(usdcToken.transfer(job.client, job.amount), "refund failed");

        emit JobCancelled(_jobId);
    }

    // view function to get job details
    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }

    // update platform fee (only platform)
    function setPlatformFee(uint256 _newFeePercent) external {
        require(msg.sender == platform, "only platform");
        require(_newFeePercent <= 1000, "fee too high"); // max 10%
        platformFeePercent = _newFeePercent;
    }
}
