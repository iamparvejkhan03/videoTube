class apiResponse{
    constructor(data, message='api successfull', statusCode  ){
        this.success=true;
        this.data=data;
        this.message=message;
        this.statusCode=statusCode < 400
    }
}

export default apiResponse;