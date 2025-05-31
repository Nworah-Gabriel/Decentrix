module sas::sas {
    use std::option::{some, none};

    /// Supported dynamic value types
    public enum Value has copy, drop, store {
        U64(u64),
        Bool(bool),
        Addr(address),
        Bytes(vector<u8>),
    }

    /// Stores multiple keys and corresponding values
    public struct KVPair has copy, drop, store {
        keys: vector<vector<u8>>,
        values: vector<Value>,
    }

    /// Top-level container of all key-value groups
    public struct DynamicStruct has key, store {
        id: UID,
        data: vector<KVPair>,
    }

    fun init(ctx: &mut TxContext) {
        let dynamic = DynamicStruct {
            id: object::new(ctx),
            data: vector::empty<KVPair>(),
        };
        transfer::transfer(dynamic, tx_context::sender(ctx));
    }
    

    /// Pushes a new key-value pair into the DynamicStruct
    /// Entry function to push a key-value pair into the DynamicStruct
    /// `variant`: 0 = U64, 1 = Bool, 2 = Addr, 3 = Bytes
    public entry fun push(
        ds: &mut DynamicStruct,
        key: vector<u8>,
        variant: u8,
        u64_val: u64,
        bool_val: bool,
        addr_val: address,
        bytes_val: vector<u8>
    ) {
        let value = match (variant) {
            0 => Value::U64(u64_val),
            1 => Value::Bool(bool_val),
            2 => Value::Addr(addr_val),
            3 => Value::Bytes(bytes_val),
            _ => abort(1),
        };

        let len = vector::length(&ds.data);
        let mut inserted = false;
        let mut i = 0;

        while (i < len) {
            let kv = vector::borrow_mut(&mut ds.data, i);
            let keys_len = vector::length(&kv.keys);
            let mut j = 0;

            while (j < keys_len) {
                let k = vector::borrow(&kv.keys, j);
                if (*k == key) {
                    *vector::borrow_mut(&mut kv.values, j) = value;
                    inserted = true;
                    break
                };
                j = j + 1;
            };
            if (inserted) break;
            i = i + 1;
        };

        if (!inserted) {
            let new_kv = KVPair {
                keys: vector::singleton(key),
                values: vector::singleton(value),
            };
            vector::push_back(&mut ds.data, new_kv);
        };
    }



    /// Get Value by Key (returns a copy, not a reference!)
    public entry fun get_value_by_key(d: &DynamicStruct, key: vector<u8>): Option<Value> {
        let len = vector::length(&d.data);
        let mut i = 0;
        while (i < len) {
            let kv = vector::borrow(&d.data, i);
            let keys_len = vector::length(&kv.keys);
            let mut j = 0;
            while (j < keys_len) {
                let k = vector::borrow(&kv.keys, j);
                if (*k == key) {
                    let v = vector::borrow(&kv.values, j);
                    return some(*v)
                };
                j = j + 1;
            };
            i = i + 1;
        };
        none()
    }

    public entry fun get_u64(d: &DynamicStruct, key: vector<u8>): Option<u64> {
        let val = get_value_by_key(d, key);
        if (option::is_some(&val)) {
            let v_ref = option::borrow(&val);
            match (*v_ref) {
                Value::U64(u) => some(u),
                _ => none<u64>(),
            }
        } else {
            none<u64>()
        }
    }


    public entry fun get_bool(d: &DynamicStruct, key: vector<u8>): Option<bool> {
        let val = get_value_by_key(d, key);
        if (option::is_some(&val)) {
            let v_ref = option::borrow(&val);
            match (*v_ref) {
                Value::Bool(b) => some(b),
                _ => none<bool>(),
            }
        } else {
            none<bool>()
        }
    }

    public entry fun get_addr(d: &DynamicStruct, key: vector<u8>): Option<address> {
        let val = get_value_by_key(d, key);
        if (option::is_some(&val)) {
            let v_ref = option::borrow(&val);
            match (*v_ref) {
                Value::Addr(a) => some(a),
                _ => none<address>(),
            }
        } else {
            none<address>()
        }
    }

    public entry fun get_bytes(d: &DynamicStruct, key: vector<u8>): Option<vector<u8>> {
        let val = get_value_by_key(d, key);
        if (option::is_some(&val)) {
            let v_ref = option::borrow(&val);
            match (*v_ref) {
                Value::Bytes(b) => some(b),
                _ => none<vector<u8>>(),
            }
        } else {
            none<vector<u8>>()
        }
    }


}
