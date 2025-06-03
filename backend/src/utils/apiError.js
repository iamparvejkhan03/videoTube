class apiError extends Error{
    constructor(data=null, errors=[], statusCode, message='There was some error'){
        super(message);
        this.success = false;
        this.data = data;
        this.statusCode=statusCode;
        this.message=message;
        this.errors=errors
    }
}

export default apiError;