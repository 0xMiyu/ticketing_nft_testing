export type Journalist = {
  "version": "0.1.0",
  "name": "journalist",
  "instructions": [
    {
      "name": "upload",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pdaAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "author",
          "type": "string"
        },
        {
          "name": "mintAddress",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "articleAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "author",
            "type": "string"
          },
          {
            "name": "mintAddress",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidDataLength",
      "msg": "Input data exceeds max length"
    }
  ]
};

export const IDL: Journalist = {
  "version": "0.1.0",
  "name": "journalist",
  "instructions": [
    {
      "name": "upload",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pdaAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "author",
          "type": "string"
        },
        {
          "name": "mintAddress",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "articleAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "author",
            "type": "string"
          },
          {
            "name": "mintAddress",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidDataLength",
      "msg": "Input data exceeds max length"
    }
  ]
};
