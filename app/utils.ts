export const post_request = async <T>(url: string, body: T) => {
    return await fetch(url, {
        method: 'POST',
        body: body
    })
}
