module edumemorycredential::edumemorycredential;

use std::string::{Self, String};
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::TxContext;

public struct LearningCredential has key, store {
    id: UID,
    student_name: String,
    credential_name: String,
    teacher_name: String,
    walrus_blob_id: String,
    issued_at_ms: u64,
}

public entry fun issue_credential(
    student_name: vector<u8>,
    credential_name: vector<u8>,
    teacher_name: vector<u8>,
    walrus_blob_id: vector<u8>,
    issued_at_ms: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let credential = LearningCredential {
        id: object::new(ctx),
        student_name: string::utf8(student_name),
        credential_name: string::utf8(credential_name),
        teacher_name: string::utf8(teacher_name),
        walrus_blob_id: string::utf8(walrus_blob_id),
        issued_at_ms,
    };

    transfer::transfer(credential, recipient);
}
