const formatAnswer = (answer) => {
    const correctAnswer = answer.split('~|')[0];

    if (correctAnswer.indexOf('~>') >= 0) {
        let correctAnswerParts = correctAnswer.split('~>');
        let result = correctAnswerParts[0];
        for (let i = 1; i < correctAnswerParts.length; i++) {
            result += ', ' + correctAnswerParts[i];
        }
        return result;
    } else if (correctAnswer.indexOf('~+') >= 0) {
        let correctAnswerParts = correctAnswer.split('~+');
        let result = correctAnswerParts[0];
        for (let i = 1; i < correctAnswerParts.length; i++) {
            result += ', ' + correctAnswerParts[i];
        }
        return result;
    } else {
        return correctAnswer;
    }
};

export default formatAnswer;
