import { Server, Socket } from "socket.io";
import http from 'http'
import { ListenerConfig } from "@common/types/ListernerConfig";
import SocketAdapterController from "@common/adapter/controller/SocketAdapterController";
import { EmmitterToType } from "@common/types/EmitterToType";
import AuthenticateMiddleware from "@common/middleware/AuthenticateMiddleware";
import MiddlewareAdapter from "@common/middleware/MidllewareAdapter";

export default class SocketConfigurator {
    private static instance: SocketConfigurator

    private _socket: Server;
    private _dataBase: IMemoryDataBase;
    private _listenerConfig: ListenerConfig[] = [];

    constructor () {
        this._socket = new Server();
    }

    public static getInstance(): SocketConfigurator {
        if (!SocketConfigurator.instance) {
            SocketConfigurator.instance = new SocketConfigurator();
        }
        return SocketConfigurator.instance;
    }

    private configureListeners(socket: Socket, userId: string) {
        this._listenerConfig.forEach(listener => {
            socket.on(listener.path, async (data: Record<string, any>, callback: Function) => {
                try {
                    if (listener.room) {
                        socket.join(listener.room)
                    }
                    data.user = { id: userId }
                    const response = await SocketAdapterController.adapter(listener.controller, data, listener.middleware);
                    callback(response);
                } catch (error) {
                    callback(error);
                }
            });
        });
    }


    public attachServer(server: http.Server) {
        this._socket.attach(server);
    }

    
    public inicializerSocket() {
        this._socket.on("connection", async (socket: Socket) => {                        
            try {
                const userId = MiddlewareAdapter.isAuthenticate(socket.handshake.headers.authorization, true) as string;
                await this._dataBase.set(userId, socket.id);
                
                this.configureListeners(socket, userId);
                socket.on("disconnect", () => {
                    this._dataBase.delete(userId);
                });

            } catch {
                socket.disconnect();
                return
            }
        });
    }
    
    public async emit<T = Record<string, unknown>>(event: string, data: T, to?: EmmitterToType): Promise<void> {        
        if (to) {            
            if (to.clientId){
                const clientId = await this._dataBase.get<string>(to.clientId);
                if (clientId) {                
                    this._socket.to(clientId).emit(event, data);
                } 
            } else if (to.room) {
                this._socket.to(to.room).emit(event, data)
            }
        } else {
            this._socket.emit(event, data);
        }
    }

    public set database (database: IMemoryDataBase) {
        this._dataBase = database;
    }
    
    public set socketConfig(socketConfig: ListenerConfig[]) {
        this._listenerConfig.push(...socketConfig)
    }
}