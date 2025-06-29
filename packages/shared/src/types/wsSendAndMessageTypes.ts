interface wsPacket {
    eventName: string,
    requestId?: string,
    data: any
}

export { wsPacket }