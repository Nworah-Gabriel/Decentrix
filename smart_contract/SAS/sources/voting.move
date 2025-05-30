module sas::voting {

    use sui::table;

    /// Voter info
    public struct Voter has copy, drop, store {
        voted: bool,
    }

    /// Proposal data
    public struct Proposal has copy, drop, store {
        name: vector<u8>,
        vote_count: u64,
    }

    /// Main voting system
    public struct VotingSystem has key {
        id: UID,
        proposals: vector<Proposal>,
        voters: table::Table<address, Voter>,
    }

    /// Initializes a new VotingSystem and transfers to caller
    public entry fun create(ctx: &mut TxContext): bool {
        let id = object::new(ctx);
        let voters = table::new<address, Voter>(ctx);
        let system = VotingSystem {
            id,
            proposals: vector::empty<Proposal>(),
            voters,
        };
        transfer::transfer(system, tx_context::sender(ctx));
        return true
    }

    /// Adds a new proposal by name
    public entry fun add_proposal(system: &mut VotingSystem, name: vector<u8>) {
        let proposal = Proposal { name, vote_count: 0 };
        vector::push_back(&mut system.proposals, proposal);
    }

    /// Cast a vote for a given proposal index
    public entry fun vote(system: &mut VotingSystem, index: u64, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);

        if (table::contains(&system.voters, sender)) {
            let voter = table::borrow(&system.voters, sender);
            assert!(!voter.voted, 0); // Error code 0 = already voted
        };

        let voter = Voter { voted: true };
        table::add(&mut system.voters, sender, voter);

        let proposal_ref = vector::borrow_mut(&mut system.proposals, index);
        proposal_ref.vote_count = proposal_ref.vote_count + 1;
    }
}
