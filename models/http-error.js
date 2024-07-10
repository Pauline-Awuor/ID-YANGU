 class HttpError extends Error {
    content;
    code;

    constructor (message, content, code) {
        super(message);
        this.content = content;
        this.code = code;
    }
}

module.exports =HttpError;