// Source: https://stackoverflow.com/a/61511955
const waitForElement = async (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const waitForChild = async (parent, selector) => {
    return new Promise(resolve => {
        // Determine if parent is a selector string or a DOM element
        const parentElement = typeof parent === 'string' ? document.querySelector(parent) : parent;

        if (!parentElement) {
            throw new Error('Parent element not found');
        }

        if (parentElement.querySelector(selector)) {
            return resolve(parentElement.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (parentElement.querySelector(selector)) {
                observer.disconnect();
                resolve(parentElement.querySelector(selector));
            }
        });

        observer.observe(parentElement, {
            childList: true,
            subtree: true
        });
    });
};

const observeHiddenInputValue = async (element, callback) => {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                    callback(element.value);
                }
            }
        });

        const config = { attributes: true, attributeFilter: ['value'] };

        observer.observe(element, config);

        resolve(observer);
    });
}
