interface wsSend {
    sentEvent: string,
    data: {}
}

interface wsMessage {
    messageEvent: string,
    data: {}
}

export { wsSend, wsMessage }