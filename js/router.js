module.exports = ({ controller }) => {
    return {
        'get /': controller.index.index
    }
}