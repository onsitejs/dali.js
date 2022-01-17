async function dali(params) {
    const repetitions = params[0];
    const seed = params[1];
    
    const width = params[2];
    const height = params[2];

    const offset = params[3];
    const multiplier = params[4];
    const fontsize = params[5];
    const maxblur = params[6];

    class Prng {
        constructor(seed) {
            this.currentNumber = seed % offset;
            if (this.currentNumber <= 0) {
                this.currentNumber += offset
            }
        }
        getNext() {
            this.currentNumber = multiplier * this.currentNumber % offset;
            return this.currentNumber;
        }
    }

    async function digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
     }
     

    function adaptRandomNumberToContext(randomNumber, maxBound, floatAllowed) {
        randomNumber = (randomNumber - 1) / offset;
        if (floatAllowed) {
            return randomNumber * maxBound;
        }

        return Math.floor(randomNumber * maxBound);
    }

    function addRandomCanvasGradient(prng, context) {
        const canvasGradient = context.createRadialGradient(
            adaptRandomNumberToContext(prng.getNext(), width),
            adaptRandomNumberToContext(prng.getNext(), height),
            adaptRandomNumberToContext(prng.getNext(), width),
            adaptRandomNumberToContext(prng.getNext(), width),
            adaptRandomNumberToContext(prng.getNext(), height),
            adaptRandomNumberToContext(prng.getNext(), width)
        );
        canvasGradient.addColorStop(0, colors[adaptRandomNumberToContext(prng.getNext(), colors.length)]);
        canvasGradient.addColorStop(1, colors[adaptRandomNumberToContext(prng.getNext(), colors.length)]);
        context.fillStyle = canvasGradient
    }

    function generateRandomWord(prng, wordLength) {
        const minAscii = 65;
        const maxAscii = 126;
        const wordGenerated = [];
        for (let i = 0; i < wordLength; i++) {
            const asciiCode = minAscii + (prng.getNext() % (maxAscii - minAscii));
            wordGenerated.push(String.fromCharCode(asciiCode));
        }

        return wordGenerated.join('');
    }

    if (!window.CanvasRenderingContext2D) {
        return 'unknown';
    }

    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

    const primitives = [
        function arc (prng, context) {
            context.beginPath();
            context.arc(
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height),
                adaptRandomNumberToContext(prng.getNext(), Math.min(width, height)),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true)
            );
            context.stroke()
        },
        function text (prng, context) {
            const wordLength = Math.max(1, adaptRandomNumberToContext(prng.getNext(), 5));
            const textToStroke = generateRandomWord(prng, wordLength);
            context.font = `${fontsize}px aafakefontaa`;

            context.strokeText(
              textToStroke,
              adaptRandomNumberToContext(prng.getNext(), width),
              adaptRandomNumberToContext(prng.getNext(), height),
              adaptRandomNumberToContext(prng.getNext(), width)
            )
        },
        function bezierCurve (prng, context) {
            context.beginPath();
            context.moveTo(
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height)
            );
            context.bezierCurveTo(
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height),
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height),
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height)
            );
            context.stroke()
        },
        function quadraticCurve(prng, context) {
            context.beginPath();
            context.moveTo(
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height)
            );
            context.quadraticCurveTo(
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height),
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height)
            );
            context.stroke()
        },
        function ellipse(prng, context) {
            context.beginPath();
            context.ellipse(
                adaptRandomNumberToContext(prng.getNext(), width),
                adaptRandomNumberToContext(prng.getNext(), height),
                adaptRandomNumberToContext(prng.getNext(), Math.floor(width/2)),
                adaptRandomNumberToContext(prng.getNext(), Math.floor(height/2)),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true)
            );

            context.stroke()
        }
    ];

    try {
        const prng = new Prng(seed);
        const canvasElt = document.createElement("canvas");
        canvasElt.width = width;
        canvasElt.height = height;
        const context = canvasElt.getContext("2d");
        for (let i = 0; i < repetitions; i++) {
            addRandomCanvasGradient(prng, context);
            context.shadowBlur = adaptRandomNumberToContext(prng.getNext(), maxblur);
            context.shadowColor = colors[adaptRandomNumberToContext(prng.getNext(), colors.length)];
            const randomPrimitive = primitives[adaptRandomNumberToContext(prng.getNext(), primitives.length)];
            randomPrimitive(prng, context);
            context.fill()
            
        }
        const url = canvasElt.toDataURL();
        const hash = String(await digestMessage(url))
        return {url,hash};
    } catch (e) {console.log(e)}
}