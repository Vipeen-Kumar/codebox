import { createContext, useState, useEffect } from "react";
import { v4 as uuid } from 'uuid';

export const PlaygroundContext = createContext();

export const languageMap = {
    "cpp": {
        language: "c++",
        version: "10.2.0",
        defaultCode: 
        "#include <iostream>\n"
        + "using namespace std;\n\n"
        + "int main() {\n"
        + '\tcout << "Hello World!";\n'
        + "\treturn 0;\n"
        + "}",
    },
    "java": {
        language: "java",
        version: "15.0.2",
        defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
    }`,
    },
    "python": {
        language: "python",
        version: "3.10.0",
        defaultCode: `print("Hello World!")`,
    },
    "javascript": {
        language: "javascript",
        version: "18.15.0",
        defaultCode: `console.log("Hello World!");`,
    }
}

const PlaygroundProvider = ({ children }) => {

    const initialItems = {
        [uuid()]: {
            title: "Project",
            playgrounds: {
                [uuid()]: {
                    title: "Stack Implementation",
                    language: "cpp",
                    code: languageMap["cpp"].defaultCode,
                },
                [uuid()]: {
                    title: "Array",
                    language: "javascript",
                    code: languageMap["javascript"].defaultCode,
                },
            }
        },
    }

    const [folders, setFolders] = useState(() => {
        let localData = localStorage.getItem('playgrounds-data');
        if (localData === null || localData === undefined) {
            return initialItems;
        }

        return JSON.parse(localData);
    })

    const [chatHistories, setChatHistories] = useState(() => {
        let localChatData = localStorage.getItem('chat-histories');
        return localChatData ? JSON.parse(localChatData) : {};
    })

    useEffect(() => {
        localStorage.setItem('playgrounds-data', JSON.stringify(folders));
    }, [folders])

    useEffect(() => {
        localStorage.setItem('chat-histories', JSON.stringify(chatHistories));
    }, [chatHistories])

    const updateChatHistory = (playgroundId, messages) => {
        setChatHistories(prev => ({
            ...prev,
            [playgroundId]: messages
        }));
    };

    const deleteCard = (folderId, cardId) => {
        setFolders((oldState) => {
            const newState = { ...oldState };
            delete newState[folderId].playgrounds[cardId];
            return newState;
        });
        
        // Also delete chat history
        setChatHistories(prev => {
            const newHistories = { ...prev };
            delete newHistories[cardId];
            return newHistories;
        });
    }

    const deleteFolder = (folderId) => {
        const playgroundIds = Object.keys(folders[folderId].playgrounds);
        setFolders((oldState) => {
            const newState = { ...oldState };
            delete newState[folderId];
            return newState;
        });

        // Also delete chat histories for all playgrounds in this folder
        setChatHistories(prev => {
            const newHistories = { ...prev };
            playgroundIds.forEach(id => delete newHistories[id]);
            return newHistories;
        });
    }

    const addFolder = (folderName) => {
        setFolders((oldState) => {
            const newState = { ...oldState };

            newState[uuid()] = {
                title: folderName,
                playgrounds: {}
            }

            return newState;
        })
    }

    const addPlayground = (folderId, playgroundName, language) => {
        setFolders((oldState) => {
            const newState = { ...oldState };

            newState[folderId].playgrounds[uuid()] = {
                title: playgroundName,
                language: language,
                code: languageMap[language].defaultCode,
            }

            return newState;
        })
    }

    const addPlaygroundAndFolder = (folderName, playgroundName, cardLanguage) => {
        setFolders((oldState) => {
            const newState = { ...oldState }

            newState[uuid()] = {
                title: folderName,
                playgrounds: {
                    [uuid()]: {
                        title: playgroundName,
                        language: cardLanguage,
                        code: languageMap[cardLanguage].defaultCode,
                    }
                }
            }

            return newState;
        })
    }

    const editFolderTitle = (folderId, folderName) => {
        setFolders((oldState) => {
            const newState = { ...oldState }
            newState[folderId].title = folderName;
            return newState;
        })
    }

    const editPlaygroundTitle = (folderId, cardId, PlaygroundTitle) => {
        setFolders((oldState) => {
            const newState = { ...oldState }
            newState[folderId].playgrounds[cardId].title = PlaygroundTitle;
            return newState;
        })
    }

    const savePlayground = (folderId, cardId, newCode, newLanguage) => {
        setFolders((oldState) => {
            const newState = { ...oldState };
            newState[folderId].playgrounds[cardId].code = newCode;
            newState[folderId].playgrounds[cardId].language = newLanguage;
            return newState;
        })
    }

    const PlayGroundFeatures = {
        folders: folders,
        chatHistories: chatHistories,
        updateChatHistory: updateChatHistory,
        deleteCard: deleteCard,
        deleteFolder: deleteFolder,
        addFolder: addFolder,
        addPlayground: addPlayground,
        addPlaygroundAndFolder: addPlaygroundAndFolder,
        editFolderTitle: editFolderTitle,
        editPlaygroundTitle: editPlaygroundTitle,
        savePlayground: savePlayground,
    }

    return (
        <PlaygroundContext.Provider value={PlayGroundFeatures}>
            {children}
        </PlaygroundContext.Provider>
    )
}

export default PlaygroundProvider;