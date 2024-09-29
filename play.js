const hello = {
    first: 'hi',
    second: 'bye',
    third: 'sigh'
}

const getPosition = post => {
    return(hello[post])
}

const thii = getPosition('first')
console.log(thii)