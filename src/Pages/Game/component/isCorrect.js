String.prototype.oafuys = function () {
    let temp = this.replace(/oà/g, 'òa');
    let temp2 = temp.replace(/oá/g, 'óa');
    temp = temp2.replace(/oả/g, 'ỏa');
    temp2 = temp.replace(/oã/g, 'õa');
    temp = temp2.replace(/oạ/g, 'ọa');
    temp2 = temp.replace(/oè/g, 'òe');
    temp = temp2.replace(/oé/g, 'óe');
    temp2 = temp.replace(/oẻ/g, 'ỏe');
    temp = temp2.replace(/oẽ/g, 'õe');
    temp2 = temp.replace(/oẹ/g, 'ọe');
    temp = temp2.replace(/uỳ/g, 'ùy');
    temp2 = temp.replace(/uý/g, 'úy');
    temp = temp2.replace(/uỷ/g, 'ủy');
    temp2 = temp.replace(/uỹ/g, 'ũy');
    temp = temp2.replace(/uỵ/g, 'ụy');
    temp2 = temp.replace(/qùy/g, 'quỳ');
    temp = temp2.replace(/qúy/g, 'quý');
    temp2 = temp.replace(/qủy/g, 'quỷ');
    temp = temp2.replace(/qũy/g, 'quỹ');
    temp2 = temp.replace(/qụy/g, 'quỵ');
    temp = temp2.replace(/\n/g, '');
    return temp;
};

const isCorrect = (playersAnswer, correctAnswer) => {
    const yourAnswer = playersAnswer.trim().toLocaleLowerCase().oafuys();
    const yourAnswerParts = yourAnswer.split(',');
    for (let i = 0; i < yourAnswerParts.length; i++) yourAnswerParts[i] = yourAnswerParts[i].trim();

    const myAnswer = correctAnswer.trim().toLocaleLowerCase().oafuys().split('~|');

    let index = 0;
    for (index = 0; index < myAnswer.length; index++) {
        if (myAnswer[index].indexOf('~>') >= 0) {
            let myAnswerParts = myAnswer[index].split('~>');
            let i = 0;
            for (i = 0; i < myAnswerParts.length; i++) {
                if (yourAnswerParts[i] !== myAnswerParts[i].trim()) break;
            }
            if (i === myAnswerParts.length) {
                return true;
            }
        } else if (myAnswer[index].indexOf('~+') >= 0) {
            let myAnswerParts = myAnswer[index].split('~+');
            let i = 0;
            myAnswerParts = myAnswerParts.sort();
            let checkAnswer = yourAnswerParts.sort();
            for (i = 0; i < myAnswerParts.length; i++) {
                if (checkAnswer[i] !== myAnswerParts[i].trim()) break;
            }
            if (i === myAnswerParts.length) {
                return true;
            }
        } else if (myAnswer[index].indexOf('~/') >= 0) {
            let myAnswerParts = myAnswer[index].split('~/');
            let i = 0;
            for (i = 0; i < myAnswerParts.length; i++) {
                if (yourAnswer.indexOf(myAnswerParts[i].trim()) < 0) break;
            }
            if (i === myAnswerParts.length) {
                return true;
            }
        } else {
            if (yourAnswer === myAnswer[index]) {
                return true;
            }
        }
    }

    if (index === myAnswer.length) {
        return false;
    }
};

export default isCorrect;
