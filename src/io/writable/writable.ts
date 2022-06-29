export interface Writeable<WriteResult = void> {
    write(buffer: string | Uint8Array): WriteResult;
}
