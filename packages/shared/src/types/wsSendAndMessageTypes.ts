interface wsPacket {
    eventName: string,
    requesId?: string,
    data: any
}

export { wsPacket }