class apiResponse{
    constructor(statusCode, message='api successfull', data  ){
        this.success=true;
        this.data=data;
        this.message=message;
        this.statusCode=statusCode < 400
    }
}

export {apiResponse};