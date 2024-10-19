const _headers = {
    'Content-Type': 'application/json',
}

export const handleRequest = async ({ endpoint, headers = {}, method = 'GET', body = undefined }) => {
    return await fetch(`http://localhost:3001${endpoint}`, {
        headers: {
            ...headers,
            ..._headers
        },
        method: method,
        body: !body ? undefined : JSON.stringify(body)
    });
}

export const get = async ({ endpoint, headers = {} }) => {
    return handleRequest({ endpoint, headers });
}

export const post = async ({ endpoint, body = {}, headers = {}, method = 'POST' }) => {
    return handleRequest({ endpoint, body, headers, method });
}

export const put = async ({ endpoint, body = {}, headers = {}, method = 'PUT' }) => {
    return handleRequest({ endpoint, body, headers, method });
}

export const destroy = async ({ endpoint, body = {}, headers = {}, method = 'DELETE' }) => {
    return handleRequest({ endpoint, body, headers, method });
}
