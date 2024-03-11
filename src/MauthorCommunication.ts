type ScoreData = {
    pageCount: number;
    checks: number;
    errors: number;
    mistakes: number;
    score: number;
    maxScore: number;
    scaledScore: number;
};

export class MauthorCommunication {


    private static instance: MauthorCommunication;

    private editorInitCallback: ((message: any) => void) | null = null;

    private textChangeCallback: ((text: string) => void) | null = null;

    private resetCallback: (() => void) | null = null;

    private communicationID: string = "PYTHON_EDITOR";

    private textAreaContent: string = '';


    private scoreData: ScoreData = {
        pageCount: 0,
        checks: 0,
        errors: 0,
        mistakes: 0,
        score: 0,
        maxScore: 1,
        scaledScore: 0
    };
    initialCode: string = '';

    constructor() {
        window.onload = () => {
            this.init();
        };
        
        window.addEventListener("message", (event) => {
            this.receiveMessage(event);
        }, false);
    }

    public static getInstance(): MauthorCommunication {
        if (!MauthorCommunication.instance) {
            MauthorCommunication.instance = new MauthorCommunication();
        }
        return MauthorCommunication.instance;
    }

    private validateMessage(message: any, ownID: string): boolean {
        return message !== undefined && message.id === ownID && message.actionID !== undefined;
    }

    private sendState(): void {
        this.sendMessage('STATE_ACTUALIZATION', {iframeScore: this.scoreData, iframeState: this.textAreaContent});
    }

    public getContent(): string {
        return this.textAreaContent;
    }

    public setContent(content: string): void {
        this.textAreaContent = content;
        this.sendState()
    }

    private resetContent(): void {
        this.textAreaContent = '';
    }

    public onTextChange(callback: (text: string) => void): void {
        this.textChangeCallback = callback;
    }

    private handleTextChange(text: string): void {
        if (this.textChangeCallback) {
            this.textChangeCallback(text);
        }
    }

    public onReset(callback: () => void): void {
        this.resetCallback = callback;
    }

    private handleReset(): void {
        if (this.resetCallback) {
            this.resetCallback();
        }
    }

    public onEditorInit(callback: (message: any) => void): void {
        this.editorInitCallback = callback;
    }

    private handleEditorInit(message: any): void {
        if (this.editorInitCallback) {
            this.editorInitCallback(message);
        }
    }

    private receiveMessage(event: MessageEvent): void {
        let message = event.data;
        if (this.validateMessage(message, this.communicationID)) {
            switch (message.actionID) {
                case "STATE_ACTUALIZATION":
                    if (message.params.iframeState !== undefined) {
                        this.textAreaContent = message.params.iframeState;
                        this.scoreData = message.params.iframeScore;
                        this.handleTextChange(this.textAreaContent);

                    }
                    break;
                case "RESET":
                    this.resetContent();
                    this.sendState();


                    this.handleReset();
                    break;
                case "EDITOR_INIT":
                    this.handleEditorInit(message.params.code);
                    break;
            }
        }
    }

    public sendMessage(actionID: string, params: any): void {
        const parent = this.getOpener();

        if (parent !== null) {
            const newMessage = {id: this.communicationID, actionID: actionID, params: params};
            parent.postMessage(newMessage, '*');
        }
    }

    private getOpener(): Window | null {
        if (window.parent !== null && window.parent.postMessage !== null) {
            return window.parent;
        }
        if (window.opener !== null && window.opener.postMessage !== null) {
            return window.opener;
        }
        return null;
    }

    public generateUniqueId() {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 1000000);
        const uniqueId = `${timestamp}-${randomNum}`;
        return uniqueId;
    }


    private init(): void {
        this.sendMessage("STATE_REQUEST", {});
    }
}
