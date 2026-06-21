# EduMemoryCredential Sui Move Package

This folder contains the Sui Move source for the EduMemory Sui Overflow hackathon credential package.

## Published Testnet Package

- Package ID: `0x421376637844f477eac71c9be3d0d27244cb6c1d16f4ec12ca33210533015ec6`
- Publish Transaction Digest: `8DXeQtEuccvNtgMJZ3XtXevdgcUYn9qWTx6G4ForK5nr`
- Module: `edumemorycredential`

## Purpose

The package defines a `LearningCredential` object that can reference a Walrus Blob ID. The current web demo visualizes teacher approval and credential creation; live minting through `issue_credential()` is the next milestone.

## Build

```bash
sui move build
```
