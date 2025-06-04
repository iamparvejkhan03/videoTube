class apiError extends Error{
    constructor(statusCode, message='There was some error', data=null, errors=[]){
        super(message);
        this.success = false;
        this.data = data;
        this.statusCode=statusCode;
        this.message=message;
        this.errors=errors
    }
}

export {apiError};