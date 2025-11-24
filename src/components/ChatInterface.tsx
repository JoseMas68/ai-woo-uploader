import { ConversationStep } from '../types';

interface ChatInterfaceProps {
    loading: boolean;
    currentMessage: string;
    currentStep: ConversationStep;
    input: string;
    setInput: (value: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
    handleSkip: () => void;
    error: string;
    uploadSuccess: string;
}

export default function ChatInterface({
    loading,
    currentMessage,
    currentStep,
    input,
    setInput,
    handleSendMessage,
    handleSkip,
    error,
    uploadSuccess,
}: ChatInterfaceProps) {
    return (
        <>
            <div className="ai-message">
                <div className="message-bubble">
                    {loading && (
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    <p>{currentMessage}</p>
                </div>
            </div>

            {currentStep !== 'complete' && (
                <>
                    <form onSubmit={handleSendMessage} className="chat-input-form">
                        <div className="input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu respuesta..."
                                className="chat-input"
                                disabled={loading}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="send-button"
                                aria-label="Enviar"
                            >
                                <svg className="icon-send" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                    <button
                        type="button"
                        className="skip-button"
                        onClick={handleSkip}
                        disabled={loading}
                    >
                        Saltar este paso
                    </button>
                </>
            )}

            {error && (
                <div className="alert alert-error">
                    <svg className="icon-alert" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{error}</p>
                </div>
            )}

            {uploadSuccess && (
                <div className="alert alert-success">
                    <svg className="icon-alert" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>{uploadSuccess}</p>
                </div>
            )}
        </>
    );
}
