const refundErrorCodes = {
    MISSING_REFUND_SECTION: {
        statusCode: 'ERROR_VALUE_MISSING',
        codeLiteral: 'MISSING_REFUND_SECTION',
        code: 8300,
        description: 'Żądanie nie zawiera obiektu "refund".',
    },
    TRANS_NOT_ENDED: {
        statusCode: 'OPENPAYU_BUSINESS_​ERROR',
        codeLiteral: 'TRANS_NOT_ENDED',
        code: 9101,
        description: 'Transakcja nie jest zakończona.',
    },
    NO_BALANCE: {
        statusCode: 'OPENPAYU_BUSINESS_​ERROR',
        codeLiteral: 'NO_BALANCE',
        code: 9102,
        description: 'Brak środków na koncie do zwrotu.',
    },
    AMOUNT_TO_BIG: {
        statusCode: 'OPENPAYU_ERROR_VALUE_​INVALID',
        codeLiteral: 'AMOUNT_TO_​BIG',
        code: 9103,
        description: 'Za duża wartość.',
    },
    AMOUNT_TO_SMALL: {
        statusCode: 'OPENPAYU_ERROR_VALUE_​INVALID',
        codeLiteral: 'AMOUNT_TO_SMALL',
        code: 9104,
        description: 'Za mała wartość.',
    },
    REFUND_DISABLED: {
        statusCode: 'OPENPAYU_BUSINESS_​ERROR',
        codeLiteral: 'REFUND_​DISABLED',
        code: 9105,
        description: 'Zwroty są nieaktywne.',
    },
    REFUND_TO_OFTEN: {
        statusCode: 'OPENPAYU_BUSINESS_​ERROR',
        codeLiteral: 'REFUND_TO_​OFTEN',
        code: 9106,
        description: 'Za częsty zwrot.',
    },
    PAID: {
        statusCode: 'OPENPAYU_ERROR_VALUE_​INVALID',
        codeLiteral: 'PAID',
        code: 9108,
        description: 'Zwrot już został wykonany.',
    },
    UNKNOWN_ERROR: {
        statusCode: 'OPENPAYU_ERROR_​INTERNAL',
        codeLiteral: 'UNKNOWN_​ERROR',
        code: 9111,
        description: 'Nieznany błąd.',
    },
    REFUND_IDEMPOTENCY_MISMATCH: {
        statusCode: 'OPENPAYU_BUSINESS_​ERROR',
        codeLiteral: 'REFUND_IDEMPOTENCY_MISMATCH',
        code: 9112,
        description: 'Użyto ponownie tę samą wartość parametru extRefundId, ale inne parametry żądania się różnią.',
    },
    TRANS_BILLING_ENTRIES_NOT_COMPLETED: {
        statusCode: 'OPENPAYU_BUSINESS_​ERROR',
        codeLiteral: 'TRANS_BILLING_​ENTRIES_NOT_COMPLETED',
        code: 9113,
        description: 'Billing sklepu nie jest jeszcze kompletny.',
    },
};

export default refundErrorCodes;
