async function waitForProperty(propertyKey: string): Promise<void> {
    const propertyChain = propertyKey.split('.');
    // tslint:disable-next-line:promise-must-complete
    await new Promise((resolve, reject) => {
        let iterations = 0;
        const interval = setInterval(() => {
            let property: any = window;
            let propertyChainSuccess = true;
            for (const key of propertyChain) {
                if (!property.hasOwnProperty(key)) {
                    propertyChainSuccess = false;
                    break;
                }
                property = property[key];
            }
            if (propertyChainSuccess) {
                clearInterval(interval);
                resolve();
            }
            if (iterations > 10) {
                reject();
            }
            iterations++;
        }, 500);
    });
}

function createScriptManager(baseElement: HTMLElement) {
    const registered: Set<string> = new Set();
    return async (src: string, propertyKey?: string): Promise<void> => {
        if (!registered.has(src)) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            await new Promise(resolve => {
                script.addEventListener('load', resolve);
                baseElement.appendChild(script);
            });
            if (propertyKey) {
                await waitForProperty(propertyKey);
            }
            registered.add(src);
        }
    };
}

export default createScriptManager(document.body);
