(function() {
    // 1) Animate Revenue Bars
    const bars = document.querySelectorAll('.bar.blue, .bar.gray');
    function animateBars() {
        bars.forEach(bar => {
            const targetH = bar.getAttribute('data-h');
            if(targetH) {
                bar.style.height = '0px';
                setTimeout(() => {
                    bar.style.height = targetH + 'px';
                }, 100);
            }
        });
    }
    animateBars();

    // 2) Animated Donut (Order Time) - Canvas
    const canvas = document.getElementById('orderTimeCanvas');
    const ctx = canvas.getContext('2d');
    let startAngle = -Math.PI / 2;
    const data = [40, 32, 28]; // afternoon, evening, morning
    const colors = ['#4a90e2', '#9ba9c9', '#dfe5f0'];
    
    function drawDonut(percent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let currentAngle = startAngle;
        for (let i = 0; i < data.length; i++) {
            let angle = (data[i] / 100) * Math.PI * 2 * percent;
            let endAngle = currentAngle + angle;
            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.moveTo(canvas.width/2, canvas.height/2);
            ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 4, currentAngle, endAngle);
            ctx.fill();
            currentAngle = endAngle;
        }
        // inner white circle
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 24, 0, 2*Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.fillStyle = '#1e2f3f';
        ctx.font = 'bold 18px "Inter"';
        ctx.fillText('1,890', canvas.width/2-30, canvas.height/2+5);
        ctx.font = '10px "Inter"';
        ctx.fillStyle = '#6c7e9e';
        ctx.fillText('orders', canvas.width/2-20, canvas.height/2+22);
    }
    
    function animateDonut() {
        let step = 0;
        function frame() {
            step += 0.035;
            if (step >= 1) step = 1;
            drawDonut(step);
            if (step < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    animateDonut();

    // 3) Animated Rating Circles (Circular progress)
    const circles = document.querySelectorAll('.circle-progress');
    function animateCircle(circle, percent, color) {
        const canvasElem = circle.querySelector('canvas');
        const ctxCirc = canvasElem.getContext('2d');
        const width = canvasElem.width, height = canvasElem.height;
        let current = 0;
        const stepAnim = () => {
            current += 2;
            if (current > percent) current = percent;
            ctxCirc.clearRect(0, 0, width, height);
            // background ring
            ctxCirc.beginPath();
            ctxCirc.arc(width/2, height/2, width/2 - 8, 0, 2 * Math.PI);
            ctxCirc.strokeStyle = '#e9eef5';
            ctxCirc.lineWidth = 8;
            ctxCirc.stroke();
            // progress ring
            ctxCirc.beginPath();
            let angle = (current / 100) * 2 * Math.PI;
            ctxCirc.arc(width/2, height/2, width/2 - 8, -Math.PI/2, -Math.PI/2 + angle);
            ctxCirc.strokeStyle = color;
            ctxCirc.lineWidth = 8;
            ctxCirc.stroke();
            const numSpan = circle.querySelector('.percent-num');
            if (numSpan) numSpan.innerText = current;
            if (current < percent) requestAnimationFrame(stepAnim);
        };
        requestAnimationFrame(stepAnim);
    }

    function initRatingCircles() {
        circles.forEach(circle => {
            const percent = parseInt(circle.getAttribute('data-percent'));
            const color = circle.getAttribute('data-color');
            const canvasC = circle.querySelector('canvas');
            canvasC.width = 130; canvasC.height = 130;
            animateCircle(circle, percent, color);
        });
    }
    initRatingCircles();

    // 4) Animate Line Chart Dots
    setTimeout(() => {
        const dots = document.querySelectorAll('.dot-anim');
        dots.forEach((dot, idx) => {
            setTimeout(() => { dot.style.opacity = '1'; dot.style.transition = 'opacity 0.4s'; }, 400 + idx * 100);
        });
    }, 600);

    // 5) Count-up effect for main stats
    const revenueSpan = document.getElementById('revenueValue');
    const orderSpan = document.getElementById('orderTotal');
    function countUp(el, target, isCurrency = true) {
        let start = 0;
        const stepTime = 20;
        const totalSteps = 40;
        let stepVal = target / totalSteps;
        let current = 0;
        const interval = setInterval(() => {
            current += stepVal;
            if (current >= target) {
                if (isCurrency) el.innerText = `IDR ${target.toLocaleString()}`;
                else el.innerText = Math.round(target).toLocaleString();
                clearInterval(interval);
            } else {
                if (isCurrency) el.innerText = `IDR ${Math.floor(current).toLocaleString()}`;
                else el.innerText = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    }
    countUp(revenueSpan, 7852000, true);
    countUp(orderSpan, 2568, false);

    // 6) View Report interactive buttons
    document.getElementById('revenueReportBtn')?.addEventListener('click', () => alert("📊 Revenue report: +2.1% growth, IDR 7.85M"));
    document.getElementById('orderTimeReportBtn')?.addEventListener('click', () => alert("🕒 Order Time: Afternoon 40% (1890 orders), Evening 32%, Morning 28%"));
    document.getElementById('orderReportBtn')?.addEventListener('click', () => alert("📦 Order summary: 2,568 total orders, -2.1% vs last week"));

    // 7) Micro-interaction: hover scale on rating circles
    const innerDivs = document.querySelectorAll('.circle-inner');
    innerDivs.forEach(div => {
        div.addEventListener('mouseenter', () => { div.style.transform = 'scale(1.05)'; div.style.transition = '0.2s'; });
        div.addEventListener('mouseleave', () => { div.style.transform = 'scale(1)'; });
    });
})();