
export default (app: any) => {

    const { controller } = app;
    return {
        'get /': controller.user.index
    }
}