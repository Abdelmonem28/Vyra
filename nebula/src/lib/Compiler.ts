export default function JSCompiler(component: string, data: { [key: string]: any }): string {
    const matches = component.matchAll(/{{(.*?)}}/g);
    let match = matches.next();
    let arr = [];
    while (!match.done) {
        let [full, value] = match.value;
        arr.push({ full, value });

        if (arr[0].value.includes('#if') && arr[arr.length - 1].value.includes('/if')) {
            const i = component.indexOf(arr[0].full);
            const j = component.indexOf(arr[arr.length - 1].full);
            let s = component.slice(i, j + arr[arr.length - 1].full.length + 1);
            component = component.replace(s, ifCompiler(s, data, arr));
            for (let k = 0; k < arr.length; k++) {
                arr.pop();
            }
            arr.pop();
            return JSCompiler(component, data);
        } else if (arr[0].value.includes('#each') && arr[arr.length - 1].value.includes('/each')) {
            const i = component.indexOf(arr[0].full);
            const j = component.indexOf(arr[arr.length - 1].full);
            let s = component.slice(i, j + arr[arr.length - 1].full.length + 1);
            component = component.replace(s, eachCompiler(s, data, arr));
            for (let k = 0; k < arr.length; k++) {
                arr.pop();
            }
            arr.pop();
            return JSCompiler(component, data);
        } else if (!value.includes('#if') && !value.includes('#each') && !value.includes('this') && !value.includes('else') && !value.includes('/if') && !value.includes('/each')) {
            component = component.replace(full, singelCompiler(value, data));
            arr.pop();
        }
        match = matches.next();
    }
    if (arr.length !== 0) {
        let isEnding = false;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            isEnding = element.value.includes("/if") || element.value.includes("/each");
            if (isEnding)
                break;
        }
        if (!isEnding)
            throw new Error("there is syntax error in the compilation");
        else
            component = component.replaceAll(/({{\s*\/if\s*}})|({{\s*\/each\s*}})/g, "");
    }
    return component;
}

function ifCompiler(component: string, data: { [key: string]: any }, arr: { full: string, value: string }[]): string {
    if (arr[0].value.includes('(') && arr[0].value.includes(')')) {
        let i = arr[0].value.indexOf('(');
        let j = arr[0].value.indexOf(')');
        let m;
        let isElse = false;
        let [condtion, paramter] = arr[0].value.slice(i + 1, j).split(' ').filter(ele => ele !== "");
        for (let k = 0; k < arr.length; k++) {
            const element = arr[k];
            isElse = element.value.includes('else');
            if (isElse) {
                j = component.indexOf(element.full);
                m = element.full.length;
                break;
            }
        }

        i = component.indexOf(arr[0].full);
        let k = component.indexOf(arr[arr.length - 1].full);

        if (isElse) {
            if (data[condtion](data[paramter] || paramter))
                return component.slice(i + arr[0].full.length + 1, j);
            else
                if (m)
                    return component.slice(j + m + 1, k);
        } else {
            if (data[condtion](data[paramter] || paramter))
                return component.slice(i + arr[0].full.length + 1, k);
        }

    } else if (arr[0].value.includes('(') || arr[0].value.includes(')')) {
        throw new Error("there is an error" + arr[0].full);

    } else {
        let [, condtion] = arr[0].value.split(' ').filter(ele => ele !== "");
        let isElse = false;
        let j;
        let m;
        for (let k = 0; k < arr.length; k++) {
            const element = arr[k];
            isElse = element.value.includes('else');
            if (isElse) {
                j = component.indexOf(element.full);
                m = element.full.length;
                break;
            }
        }

        let i = component.indexOf(arr[0].full);
        let k = component.indexOf(arr[arr.length - 1].full);

        if (isElse) {
            if (data[condtion])
                return component.slice(i + arr[0].full.length + 1, j);
            else
                if (m && j)
                    return component.slice(j + m + 1, k);
        } else {
            if (data[condtion])
                return component.slice(i + arr[0].full.length + 1, k);
        }
    }
    throw new Error("some thing wrong");
}

function eachCompiler(component: string, data: { [key: string]: any }, arr: { full: string, value: string }[]): string {
    let [, loopArr] = arr[0].value.split(" ").filter(ele => ele !== "");
    const i = component.indexOf(arr[0].full);
    const j = component.indexOf(arr[arr.length - 1].full);

    const thisArr = [];
    const thisArr2 = [];
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.value.includes("this")) {
            thisArr.push(element.value.match(/this(\.?)[\s\S]*/g));
            thisArr2.push(element.full);
        }
    }

    let temp = component.slice(i + arr[0].full.length + 1, j);
    let result = '';

    for (let i = 0; i < data[loopArr].length; i++) {
        let temp2: string = temp;
        for (let j = 0; j < thisArr2.length; j++) {
            temp2 = temp2.replaceAll(thisArr2[j], singelCompiler(thisArr[j][0].replace("this", loopArr), data, i));
        }
        result += temp2;
    }

    return JSCompiler(result, data);
}

function singelCompiler(value: string, data: { [key: string]: any }, index?: number) {
    let arr = value.split('.');
    if (index || index === 0) {
        let Array: [] = data[arr[0]] || arr[0];
        let element = Array[index];
        for (let i = 1; i < arr.length; i++) {
            element = element[arr[i]] || arr[i];
        }
        return element;
    } else {
        let element = data[arr[0]] || arr[0];
        for (let i = 1; i < arr.length; i++) {
            element = element[arr[i]] || arr[i];
        }
        return element;
    }
}




// let match = mathces.next();
// let arr: string[] = [];
// let fullArr = [];
// while (!match.done) {
//     const [full, key] = match.value;
//     arr.push(...key.split(' ')
//         .map((ele) => {
//             if (ele.startsWith("("))
//                 return ele.slice(1);
//             else if (ele.endsWith(")"))
//                 return ele.slice(0, -1);
//             else
//                 return ele;
//         })
//         .filter((ele) => ele !== '')
//         .filter((ele) => ele !== ')')
//         .filter((ele) => ele !== '('));
//     fullArr.push(full);
//     console.log(arr, fullArr);
//     if (arr[arr.length - 1] === '/if' || arr[arr.length - 1] === '/each') {
//         console.log(arr[arr.length - 1]);
//     }
//     match = mathces.next();
// }