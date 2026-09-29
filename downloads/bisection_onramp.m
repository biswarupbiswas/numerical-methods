function fig = bisection_onramp
%BISECTION_ONRAMP  Interactive, self-paced practice for Lecture 1: The Bisection Method.
%
%   Type  bisection_onramp  and press Enter. A window opens with 9 short tasks.
%   Everything is done by clicking, dragging sliders and typing numbers:
%   no coding needed. Use the task list on the left to jump between tasks.

f = @(x) x.^3 - x - 2;
xstar = fzero(f, [1 2]);

% ---------------- colours ----------------
C.navy   = [0.06 0.16 0.33];  C.blue  = [0.10 0.45 0.91];  C.side = [0.95 0.96 0.98];
C.white  = [1 1 1];           C.text  = [0.13 0.14 0.16];  C.muted = [0.40 0.42 0.46];
C.green  = [0.07 0.55 0.27];  C.greenBg = [0.89 0.96 0.91];
C.red    = [0.78 0.15 0.11];  C.redBg   = [0.99 0.91 0.90];
C.hint   = [0.10 0.35 0.75];  C.hintBg  = [0.91 0.94 1.00];
C.orange = [0.85 0.45 0.05];  C.gold  = [0.98 0.74 0.02];  C.track = [0.30 0.37 0.52];
C.curve  = [0.10 0.45 0.91];  C.pos   = [0.07 0.62 0.30];  C.neg  = [0.86 0.20 0.15];
C.card   = [0.97 0.98 1.00];  C.cardSel = [0.86 0.91 1.00];

titles = ["Evaluate f at the endpoints", "Choose a starting interval", "Why continuity matters", ...
          "Bisection by hand", "Stopping criteria", "The error bound", "How many iterations?", ...
          "When bisection fails", "Put the algorithm in order"];
navNames = ["Evaluate f", "Starting interval", "Continuity", "Bisection by hand", "Stopping criteria", ...
            "Error bound", "Number of iterations", "When it fails", "The algorithm"];
builders = {@taskEvaluate, @taskBracket, @taskContinuity, @taskByHand, @taskStopping, ...
            @taskErrorBound, @taskIterations, @taskTouching, @taskAlgorithm};
N = numel(builders);

% status: 0 = not done, 1 = solved without help (star), 2 = solved with hints/tries, 3 = answer shown
status = zeros(1, N);
current = 1; attempts = 0; hintIdx = 0; hintUsed = false;
T = struct(); W = struct(); choice = 0; cards = gobjects(0);

% ---------------- window ----------------
fig = uifigure('Name', 'Numerical Methods · Bisection Onramp', 'Position', [60 40 1240 760], ...
               'Color', C.white);
main = uigridlayout(fig, [2 2], 'RowHeight', {72, '1x'}, 'ColumnWidth', {285, '1x'}, ...
                    'Padding', 0, 'RowSpacing', 0, 'ColumnSpacing', 0, 'BackgroundColor', C.white);

hdr = uigridlayout(main, [1 3], 'ColumnWidth', {'1x', 320, 120}, 'Padding', [22 10 22 10], ...
                   'BackgroundColor', C.navy);
hdr.Layout.Row = 1; hdr.Layout.Column = [1 2];
uilabel(hdr, 'Text', '<b>Numerical Methods</b>&nbsp;&nbsp;·&nbsp;&nbsp;Lecture 1: The Bisection Method', ...
        'Interpreter', 'html', 'FontSize', 20, 'FontColor', C.white);
prog = uigridlayout(hdr, [1 N], 'Padding', [0 21 0 21], 'ColumnSpacing', 5, 'BackgroundColor', C.navy);
seg = gobjects(1, N);
for j = 1:N
    seg(j) = uipanel(prog, 'BackgroundColor', C.track, 'BorderType', 'none');
end
progLbl = uilabel(hdr, 'FontColor', C.white, 'FontSize', 15, 'HorizontalAlignment', 'right');

side = uigridlayout(main, [N + 2 1], 'RowHeight', [{34}, repmat({50}, 1, N), {'1x'}], ...
                    'Padding', [12 16 12 16], 'RowSpacing', 4, 'BackgroundColor', C.side);
side.Layout.Row = 2; side.Layout.Column = 1;
uilabel(side, 'Text', 'TASKS', 'FontWeight', 'bold', 'FontColor', C.muted, 'FontSize', 13);
nav = gobjects(1, N);
for j = 1:N
    nav(j) = uibutton(side, 'HorizontalAlignment', 'left', 'FontSize', 14, ...
                      'BackgroundColor', C.side, 'ButtonPushedFcn', @(~, ~) showTask(j));
end
starLbl = uilabel(side, 'VerticalAlignment', 'bottom', 'FontColor', C.muted, 'FontSize', 14, ...
                  'WordWrap', 'on');

content = uigridlayout(main, [1 2], 'ColumnWidth', {480, '1x'}, 'Padding', [26 18 26 18], ...
                       'ColumnSpacing', 26, 'BackgroundColor', C.white);
content.Layout.Row = 2; content.Layout.Column = 2;
left = uigridlayout(content, [6 1], 'RowHeight', {20, 40, 118, '1x', 66, 44}, 'Padding', 0, ...
                    'RowSpacing', 10, 'BackgroundColor', C.white);
stepLbl  = uilabel(left, 'FontColor', C.blue, 'FontWeight', 'bold', 'FontSize', 13);
titleLbl = uilabel(left, 'FontSize', 25, 'FontWeight', 'bold', 'FontColor', C.text);
instr    = uilabel(left, 'Interpreter', 'html', 'WordWrap', 'on', 'FontSize', 15, ...
                   'FontColor', C.text, 'VerticalAlignment', 'top');
work     = uipanel(left, 'BorderType', 'none', 'BackgroundColor', C.white);
fbPanel  = uipanel(left, 'BorderType', 'none', 'BackgroundColor', C.white);
fbGrid   = uigridlayout(fbPanel, [1 1], 'Padding', [14 4 14 4], 'BackgroundColor', C.white);
fbText   = uilabel(fbGrid, 'Text', '', 'WordWrap', 'on', 'FontSize', 15, 'Interpreter', 'html');
btns = uigridlayout(left, [1 5], 'ColumnWidth', {80, 120, '1x', 110, 110}, 'Padding', 0, ...
                    'BackgroundColor', C.white);
hintBtn   = uibutton(btns, 'Text', 'Hint', 'FontSize', 14, 'Tag', 'hint', 'ButtonPushedFcn', @(~, ~) onHint());
revealBtn = uibutton(btns, 'Text', 'Show answer', 'FontSize', 14, 'Tag', 'reveal', ...
                     'ButtonPushedFcn', @(~, ~) onReveal());
checkBtn  = uibutton(btns, 'Text', 'Check', 'FontSize', 15, 'FontWeight', 'bold', 'Tag', 'check', ...
                     'BackgroundColor', C.blue, 'FontColor', C.white, 'ButtonPushedFcn', @(~, ~) onCheck());
checkBtn.Layout.Column = 4;
nextBtn   = uibutton(btns, 'Text', 'Next  →', 'FontSize', 15, 'Tag', 'next', ...
                     'ButtonPushedFcn', @(~, ~) onNext());
nextBtn.Layout.Column = 5;

ax = uiaxes(content);
ax.Layout.Column = 2;

showTask(1);
if nargout == 0, clear fig; end

% =====================================================================
%                          NAVIGATION & FEEDBACK
% =====================================================================

    function showTask(k)
        current = k; attempts = 0; hintIdx = 0; hintUsed = false; choice = 0;
        delete(work.Children);
        resetAxes();
        stepLbl.Text = sprintf('TASK %d OF %d', k, N);
        titleLbl.Text = titles(k);
        T = builders{k}();
        instr.Text = T.html;
        feedback('none', '');
        set([hintBtn revealBtn checkBtn], 'Visible', 'on');
        checkBtn.Enable = 'on';
        refreshChrome();
    end

    function onCheck()
        [res, msg] = T.check();
        switch res
            case "done"
                if status(current) == 0
                    status(current) = 1 + (attempts > 0 || hintUsed);
                end
                feedback('ok', msg);
                checkBtn.Enable = 'off';
            case "step"
                feedback('ok', msg);
            otherwise
                attempts = attempts + 1;
                if attempts >= 2 && hintIdx < numel(T.hints)
                    msg = msg + "<br>Stuck? Try the <b>Hint</b> button.";
                end
                feedback('bad', msg);
        end
        refreshChrome();
    end

    function onHint()
        hintUsed = true;
        hintIdx = min(hintIdx + 1, numel(T.hints));
        feedback('hint', T.hints{hintIdx});
    end

    function onReveal()
        if status(current) == 0, status(current) = 3; end
        feedback('info', "<b>Answer:</b> " + T.answer);
        refreshChrome();
    end

    function onNext()
        if current < N
            showTask(current + 1);
        else
            showSummary();
        end
    end

    function feedback(kind, msg)
        switch kind
            case 'ok',   bg = C.greenBg; fg = C.green; msg = "✔ " + msg;
            case 'bad',  bg = C.redBg;   fg = C.red;   msg = "✘ " + msg;
            case 'hint', bg = C.hintBg;  fg = C.hint;  msg = "Hint: " + msg;
            case 'info', bg = C.side;    fg = C.text;
            otherwise,   bg = C.white;   fg = C.text;
        end
        fbPanel.BackgroundColor = bg; fbGrid.BackgroundColor = bg;
        fbText.Text = sprintf('<span style="color:%s">%s</span>', hex(fg), msg);
    end

    function refreshChrome()
        icons = ["○", "★", "✓", "!"];
        for i = 1:N
            s = status(i);
            if s == 1 || s == 2
                seg(i).BackgroundColor = C.green;
            elseif s == 3
                seg(i).BackgroundColor = C.orange;
            elseif i == current
                seg(i).BackgroundColor = C.gold;
            else
                seg(i).BackgroundColor = C.track;
            end
            nav(i).Text = sprintf('%s   %d.  %s', icons(s + 1), i, navNames(i));
            nav(i).FontColor = pick(s + 1, [C.text; C.green; C.green; C.orange]);
            if i == current
                nav(i).BackgroundColor = C.white; nav(i).FontWeight = 'bold';
            else
                nav(i).BackgroundColor = C.side;  nav(i).FontWeight = 'normal';
            end
        end
        progLbl.Text = sprintf('%d / %d done', nnz(status > 0), N);
        starLbl.Text = sprintf('★  %d solved first time\n✓  %d solved with help\n!   %d answers shown', ...
                               nnz(status == 1), nnz(status == 2), nnz(status == 3));
        if current == N
            nextBtn.Text = 'Finish  →';
        elseif status(current) > 0
            nextBtn.Text = 'Next  →';
        else
            nextBtn.Text = 'Skip  →';
        end
    end

    function showSummary()
        delete(work.Children);
        resetAxes();
        stepLbl.Text = 'COMPLETE';
        titleLbl.Text = 'Lecture 1 complete!';
        stars = nnz(status == 1); solved = nnz(status == 1 | status == 2);
        instr.Text = sprintf(['You solved <b>%d of %d</b> tasks, <b>%d</b> of them first time.<br><br>' ...
            'Tasks marked <span style="color:%s"><b>!</b></span> or <b>○</b> are worth another look: ' ...
            'rewatch that part of the video, then click the task on the left to try again.'], ...
            solved, N, stars, hex(C.orange));
        labels = ["not done", "★ first time", "✓ with help", "! answer shown"];
        uitable(uigridlayout(work, [1 1], 'Padding', 0, 'BackgroundColor', C.white), ...
            'Data', table(titles', labels(status + 1)', 'VariableNames', {'Task', 'Result'}), ...
            'ColumnWidth', {300, 'auto'}, 'RowName', {}, 'FontSize', 14);
        a = 1; b = 2;
        for n = 1:12
            c = (a + b) / 2;
            if f(a) * f(c) < 0, b = c; else, a = c; end
        end
        drawBracket(a, b, [0.9 2.1]);
        plot(ax, xstar, 0, 'p', 'MarkerSize', 22, 'MarkerFaceColor', C.gold, 'MarkerEdgeColor', C.text);
        title(ax, sprintf('x^* = %.6f', xstar), 'FontSize', 16);
        feedback('ok', sprintf('Well done! Score: %d / %d', solved, N));
        set([hintBtn revealBtn checkBtn], 'Visible', 'off');
        nextBtn.Text = 'Start over';
        nextBtn.ButtonPushedFcn = @(~, ~) restart();
        progLbl.Text = sprintf('%d / %d done', nnz(status > 0), N);
    end

    function restart()
        status(:) = 0;
        nextBtn.ButtonPushedFcn = @(~, ~) onNext();
        showTask(1);
    end

% =====================================================================
%                                 TASKS
% =====================================================================
% Each builder fills the work panel and the plot, and returns
%   html   - instructions,   check  - @() [result, message] with result "done" / "step" / "wrong",
%   hints  - cell of hint strings,   answer - text shown by "Show answer".

    function S = taskEvaluate()
        g = gridOf(work, {40, 40, 34, 60}, {90, 170, '1x'});
        W.f1 = numRow(g, 1, 'f(1) =', 'ans1');
        W.f2 = numRow(g, 2, 'f(2) =', 'ans2');
        q = uilabel(g, 'Text', 'Does f change sign on [1, 2]?', 'FontSize', 15);
        q.Layout.Row = 3; q.Layout.Column = [1 3];
        og = gridOf(g, {'1x'}, {'1x', '1x'}); og.Layout.Row = 4; og.Layout.Column = [1 3];
        optionCards(og, ["Yes", "No"]);

        fplot(ax, f, [-0.5 2.5], 'LineWidth', 2.5, 'Color', C.curve);
        ylim(ax, [-4 6]); title(ax, 'f(x) = x^3 - x - 2', 'FontSize', 15);

        S.html = ['We want to solve <b>f(x) = x<sup>3</sup> − x − 2 = 0</b>.<br>' ...
                  'A root is where the curve crosses the x-axis.<br><br>' ...
                  'Work out <b>f(1)</b> and <b>f(2)</b>, then decide whether f changes sign on [1, 2].'];
        S.hints = {'Substitute x = 1:  1<sup>3</sup> − 1 − 2.', ...
                   'f(2) = 2<sup>3</sup> − 2 − 2.  One value is negative and one is positive.'};
        S.answer = 'f(1) = −2 and f(2) = 4. They have opposite signs, so yes: f changes sign on [1, 2].';
        S.check = @check;

        function [r, m] = check()
            r = "wrong";
            if ~near(getNum(W.f1), -2), m = "f(1) is not right yet."; return, end
            if ~near(getNum(W.f2), 4),  m = "f(2) is not right yet."; return, end
            if choice == 0, m = "Now choose Yes or No."; return, end
            if choice ~= 1, m = "Look at the signs of f(1) and f(2) again."; return, end
            plot(ax, 1, -2, 'o', 'MarkerSize', 12, 'MarkerFaceColor', C.neg, 'MarkerEdgeColor', 'none');
            plot(ax, 2, 4, 'o', 'MarkerSize', 12, 'MarkerFaceColor', C.pos, 'MarkerEdgeColor', 'none');
            plot(ax, [1 2], [0 0], '-', 'Color', C.gold, 'LineWidth', 7);
            r = "done";
            m = "f(1) = −2 is negative and f(2) = 4 is positive, so the curve must cross the axis in between.";
        end
    end

    function S = taskBracket()
        g = gridOf(work, {30, 50, 30, 50, '1x'}, {'1x'});
        W.aLbl = uilabel(g, 'FontSize', 15);
        W.sa = uislider(g, 'Limits', [-1 3], 'MajorTicks', -1:3, 'Value', 2, 'Tag', 'sa', 'FontSize', 13);
        W.bLbl = uilabel(g, 'FontSize', 15);
        W.sb = uislider(g, 'Limits', [-1 3], 'MajorTicks', -1:3, 'Value', 3, 'Tag', 'sb', 'FontSize', 13);
        W.live = uilabel(g, 'FontSize', 15, 'Interpreter', 'html', 'WordWrap', 'on', 'VerticalAlignment', 'top');
        W.sa.ValueChangingFcn = @(~, e) update(e.Value, snap(W.sb.Value));
        W.sb.ValueChangingFcn = @(~, e) update(snap(W.sa.Value), e.Value);
        W.sa.ValueChangedFcn  = @(s, ~) update(s.Value, W.sb.Value);
        W.sb.ValueChangedFcn  = @(s, ~) update(W.sa.Value, s.Value);

        fplot(ax, f, [-1 3], 'LineWidth', 2.5, 'Color', C.curve);
        ylim(ax, [-6 12]); xlim(ax, [-1 3]);
        W.band = plot(ax, [2 3], [0 0], '-', 'LineWidth', 8);
        W.dropA = plot(ax, [2 2], [0 f(2)], '--', 'LineWidth', 1.5);
        W.dropB = plot(ax, [3 3], [0 f(3)], '--', 'LineWidth', 1.5);
        W.pA = plot(ax, 2, f(2), 'o', 'MarkerSize', 12, 'MarkerEdgeColor', 'none');
        W.pB = plot(ax, 3, f(3), 'o', 'MarkerSize', 12, 'MarkerEdgeColor', 'none');
        W.tA = text(ax, 2, -1, 'a', 'FontSize', 16, 'FontWeight', 'bold', 'HorizontalAlignment', 'center');
        W.tB = text(ax, 3, -1, 'b', 'FontSize', 16, 'FontWeight', 'bold', 'HorizontalAlignment', 'center');
        title(ax, 'Drag the sliders: trap the root between a and b', 'FontSize', 15);
        update(2, 3);

        S.html = ['Bisection needs a starting interval [a, b] where <b>f(a) and f(b) have opposite signs</b>, ' ...
                  'i.e. f(a)·f(b) &lt; 0.<br><br>Drag the two sliders to choose your own a and b, ' ...
                  'then click <b>Check</b>.'];
        S.hints = {'Watch the colours: red means f is negative, green means positive. You need one of each.', ...
                   'The curve crosses the axis near x = 1.5. Put a on its left and b on its right.'};
        S.answer = 'Any interval with a to the left of 1.52 and b to the right works, for example [0, 2] or [1, 3].';
        S.check = @check;

        function update(a, b)
            a = snap(a); b = snap(b);
            fa = f(a); fb = f(b);
            ok = a < b && fa * fb < 0;
            W.aLbl.Text = sprintf('a = %.2f', a);
            W.bLbl.Text = sprintf('b = %.2f', b);
            set(W.band, 'XData', [a b], 'Color', pick(1 + ok, [C.red; C.gold]));
            set(W.pA, 'XData', a, 'YData', fa, 'MarkerFaceColor', signColor(fa));
            set(W.pB, 'XData', b, 'YData', fb, 'MarkerFaceColor', signColor(fb));
            set(W.dropA, 'XData', [a a], 'YData', [0 fa], 'Color', signColor(fa));
            set(W.dropB, 'XData', [b b], 'YData', [0 fb], 'Color', signColor(fb));
            W.tA.Position(1) = a; W.tB.Position(1) = b;
            W.tA.Position(2) = -sign(fa) * 1.2; W.tB.Position(2) = -sign(fb) * 1.2;
            W.live.Text = sprintf('f(a) = <b>%s</b> &nbsp;&nbsp; f(b) = <b>%s</b>', ...
                                  signed(fa), signed(fb));
        end

        function [r, m] = check()
            a = snap(W.sa.Value); b = snap(W.sb.Value);
            r = "wrong";
            if a >= b
                m = "a must be to the left of b."; return
            end
            if f(a) * f(b) > 0
                m = sprintf('f(%.2f) and f(%.2f) have the same sign, so a root is not guaranteed.', a, b); return
            end
            r = "done";
            m = sprintf('f(%.2f)·f(%.2f) &lt; 0, so [%.2f, %.2f] is a valid starting interval.', a, b, a, b);
        end
    end

    function S = taskContinuity()
        g = gridOf(work, {'1x'}, {'1x'});
        optionCards(g, ["Yes, the Intermediate Value Theorem guarantees one", ...
                        "No, g is not continuous on [−1, 1], so the theorem does not apply", ...
                        "Yes, at x = 0"]);
        fplot(ax, @(x) 1 ./ x, [-2 -0.18], 'LineWidth', 2.5, 'Color', C.curve);
        fplot(ax, @(x) 1 ./ x, [0.18 2], 'LineWidth', 2.5, 'Color', C.curve);
        xline(ax, 0, '--', 'Color', C.gold, 'LineWidth', 2);
        plot(ax, -1, -1, 'o', 'MarkerSize', 12, 'MarkerFaceColor', C.neg, 'MarkerEdgeColor', 'none');
        plot(ax, 1, 1, 'o', 'MarkerSize', 12, 'MarkerFaceColor', C.pos, 'MarkerEdgeColor', 'none');
        ylim(ax, [-5 5]); title(ax, 'g(x) = 1/x', 'FontSize', 15);

        S.html = ['Look at <b>g(x) = 1/x</b> on [−1, 1].<br>g(−1) = −1 and g(1) = 1, so g(−1)·g(1) &lt; 0.<br><br>' ...
                  'Is there a root of g in (−1, 1)?'];
        S.hints = {'The Intermediate Value Theorem needs two things. Is g continuous on the whole interval?', ...
                   'What happens to 1/x at x = 0?'};
        S.answer = 'No. 1/x is not continuous at x = 0: it jumps from −∞ to +∞ and never equals 0.';
        S.check = @check;

        function [r, m] = check()
            r = "wrong";
            if choice == 0, m = "Choose one of the options."; return, end
            if choice ~= 2, m = "Look closely at what happens at x = 0."; return, end
            r = "done";
            m = "Right! g jumps across the axis at x = 0. Without continuity there is no guarantee.";
        end
    end

    function S = taskByHand()
        a = 1; b = 2; step = 1;
        g = gridOf(work, {30, 40, 40, 30, '1x'}, {150, 170, '1x'});
        W.stepLbl = uilabel(g, 'FontSize', 15, 'FontWeight', 'bold', 'FontColor', C.blue);
        W.stepLbl.Layout.Column = [1 3];
        W.c  = numRow(g, 2, 'Midpoint  c =', 'ans1');
        W.fc = numRow(g, 3, 'f(c) =', 'ans2');
        q = uilabel(g, 'Text', 'Which half contains the root?', 'FontSize', 15);
        q.Layout.Row = 4; q.Layout.Column = [1 3];
        W.halves = gridOf(g, {'1x'}, {'1x', '1x'}); W.halves.Layout.Row = 5; W.halves.Layout.Column = [1 3];
        newStep();

        S.html = ['Run bisection by hand on <b>[a, b] = [1, 2]</b>. For each step:<br>' ...
                  '1. compute the midpoint <b>c = (a + b)/2</b>,<br>2. compute <b>f(c)</b> (3 decimals is enough),<br>' ...
                  '3. choose the half where f changes sign.'];
        S.hints = {'c is exactly halfway between a and b: add them and divide by 2.', ...
                   'For f(c), compute c<sup>3</sup> − c − 2. A calculator is fine.', ...
                   'Keep the half whose two endpoints have OPPOSITE signs of f.'};
        S.answer = '';
        S.check = @check;
        updateAnswer();

        function newStep()
            W.stepLbl.Text = sprintf('Step %d of 3:   [a, b] = [%g, %g]', step, a, b);
            W.c.Value = ''; W.fc.Value = '';
            delete(W.halves.Children); choice = 0;
            optionCards(W.halves, [sprintf("Left half  [%g, c]", a), sprintf("Right half  [c, %g]", b)]);
            drawBracket(a, b, [0.9 2.1]);
            title(ax, sprintf('Step %d:  [a, b] = [%g, %g]', step, a, b), 'FontSize', 15);
        end

        function updateAnswer()
            c = (a + b) / 2;
            half = ["right", "left"];
            T.answer = sprintf('c = %g,  f(c) = %.4f,  keep the %s half.', c, f(c), half(1 + (f(a) * f(c) < 0)));
            S.answer = T.answer;
        end

        function [r, m] = check()
            c = (a + b) / 2; fc = f(c);
            r = "wrong";
            if ~near(getNum(W.c), c), m = "The midpoint is not right yet."; return, end
            plot(ax, [c c], [0 fc], ':', 'Color', signColor(fc), 'LineWidth', 2);
            plot(ax, c, 0, 'o', 'MarkerSize', 9, 'MarkerFaceColor', 'k', 'MarkerEdgeColor', 'none');
            if abs(getNum(W.fc) - fc) > 5e-4, m = sprintf('c = %g is right. Now check your value of f(c).', c); return, end
            plot(ax, c, fc, 'o', 'MarkerSize', 12, 'MarkerFaceColor', signColor(fc), 'MarkerEdgeColor', 'none');
            if choice == 0, m = "Good! Now choose which half to keep."; return, end
            leftHalf = f(a) * fc < 0;
            if choice ~= 1 + ~leftHalf
                m = sprintf('f(a) = %.3f and f(c) = %.3f. Which half has endpoints with opposite signs?', f(a), fc);
                return
            end
            if leftHalf, b = c; else, a = c; end
            if step < 3
                step = step + 1;
                pause(0.4);
                newStep(); updateAnswer();
                r = "step";
                m = sprintf('Correct! The root is now trapped in [%g, %g]. On to step %d.', a, b, step);
            else
                drawBracket(a, b, [0.9 2.1]);
                title(ax, sprintf('After 3 steps:  [a, b] = [%g, %g]', a, b), 'FontSize', 15);
                showMoreSteps(a, b);
                r = "done";
                m = sprintf('Excellent! After 3 steps the root is in [%g, %g]. The table shows the next steps.', a, b);
            end
        end

        function showMoreSteps(a, b)
            delete(work.Children);
            rows = zeros(7, 4);
            for n = 4:10
                c = (a + b) / 2;
                rows(n - 3, :) = [n, a, b, c];
                if f(a) * f(c) < 0, b = c; else, a = c; end
            end
            data = table(rows(:, 1), rows(:, 2), rows(:, 3), rows(:, 4), f(rows(:, 4)), ...
                         'VariableNames', {'n', 'a', 'b', 'c', 'f(c)'});
            uitable(gridOf(work, {'1x'}, {'1x'}), 'Data', data, 'RowName', {}, 'FontSize', 13);
        end
    end

    function S = taskStopping()
        g = gridOf(work, {'1x'}, {'1x'});
        optionCards(g, ["|f(c)| < tol", "(b − a)/2 < tol", "n ≥ Nmax  (a maximum number of steps)"]);
        tol = 2e-3;
        gflat = @(x) (x - 1.5).^5;
        patch(ax, [1 2 2 1], [-tol -tol tol tol], C.gold, 'FaceAlpha', 0.25, 'EdgeColor', 'none');
        fplot(ax, gflat, [1 2], 'LineWidth', 2.5, 'Color', C.curve);
        plot(ax, 1.25, gflat(1.25), 'o', 'MarkerSize', 12, 'MarkerFaceColor', C.neg, 'MarkerEdgeColor', 'none');
        plot(ax, 1.5, 0, 'p', 'MarkerSize', 18, 'MarkerFaceColor', C.pos, 'MarkerEdgeColor', 'none');
        text(ax, 1.25, 0.0045, 'c = 1.25:  |f(c)| < tol', 'FontSize', 13, 'HorizontalAlignment', 'center');
        text(ax, 1.5, -0.0045, 'root x^* = 1.5', 'FontSize', 13, 'HorizontalAlignment', 'center');
        text(ax, 1.9, tol * 1.6, 'band |f| < tol', 'FontSize', 12, 'Color', C.muted, 'HorizontalAlignment', 'center');
        ylim(ax, [-0.01 0.01]); title(ax, 'A very flat function: f(x) = (x − 1.5)^5', 'FontSize', 15);

        S.html = ['We stop bisection when the answer is accurate enough.<br><br>' ...
                  'Which stopping test <b>guarantees</b> that |c − x*| &lt; tol?  ' ...
                  '(Look at the plot for a clue.)'];
        S.hints = {'In the plot, |f(c)| is tiny at c = 1.25, but c is still 0.25 away from the root.', ...
                   'The root is always inside [a, b] and c is its midpoint. How far can c be from the root?'};
        S.answer = '(b − a)/2 &lt; tol. The root is inside [a, b], so the midpoint is at most (b − a)/2 away from it.';
        S.check = @check;

        function [r, m] = check()
            r = "wrong";
            if choice == 0, m = "Choose one of the options."; return, end
            if choice == 1, m = "Look at the plot: |f(c)| is small at c = 1.25, but c is far from the root."; return, end
            if choice == 3, m = "A cap on the steps is a safety net. It says nothing about accuracy."; return, end
            r = "done";
            m = "Right! |c − x*| ≤ (b − a)/2, so this test guarantees the accuracy.";
        end
    end

    function S = taskErrorBound()
        g = gridOf(work, {30, 50, 40, '1x'}, {170, 170, '1x'});
        W.nLbl = uilabel(g, 'FontSize', 15); W.nLbl.Layout.Column = [1 3];
        W.sn = uislider(g, 'Limits', [0 4], 'MajorTicks', 0:4, 'MinorTicks', [], 'Value', 0, 'Tag', 'sn', 'FontSize', 13);
        W.sn.Layout.Column = [1 3];
        W.sn.ValueChangingFcn = @(~, e) drawBars(round(e.Value));
        W.sn.ValueChangedFcn  = @(s, ~) drawBars(snapInt(s));
        W.eb = numRow(g, 3, 'Bound for n = 5:', 'ans1');

        S.html = ['Start with [a, b] = [1, 2]. Drag the slider to see the interval after each halving.<br><br>' ...
                  'The n-th midpoint satisfies <b>|c<sub>n</sub> − x*| ≤ (b − a) / 2<sup>n</sup></b>.<br>' ...
                  'What is this bound for <b>n = 5</b>?  (You may type 1/32.)'];
        S.hints = {'b − a = 1, so the bound is 1/2<sup>5</sup>.', 'You can type the answer as 1/32 or 2^-5.'};
        S.answer = '1/2<sup>5</sup> = 1/32 = 0.03125.';
        S.check = @check;
        drawBars(0);

        function drawBars(n)
            cla(ax); hold(ax, 'on');
            a = 1; b = 2;
            for k = 0:n
                y = -k;
                plot(ax, [a b], [y y], '-', 'LineWidth', 9, 'Color', interp(C.curve, C.gold, k / 4));
                text(ax, 2.08, y, sprintf('width = 1/2^{%d} = %g', k, 1 / 2^k), 'FontSize', 13);
                c = (a + b) / 2;
                if f(a) * f(c) < 0, b = c; else, a = c; end
            end
            xline(ax, xstar, '--', 'root x^*', 'Color', C.pos, 'LineWidth', 2, 'FontSize', 14, ...
                  'LabelVerticalAlignment', 'top', 'LabelOrientation', 'horizontal');
            xlim(ax, [0.95 2.75]); ylim(ax, [-4.8 0.8]); ax.YTick = [];
            title(ax, sprintf('After %d halvings', n), 'FontSize', 15);
            W.nLbl.Text = sprintf('Halvings shown: %d', n);
        end

        function [r, m] = check()
            r = "wrong";
            v = getNum(W.eb);
            if isnan(v), m = "Type a number, e.g. 0.1 or 1/10."; return, end
            if near(v, 1/16), m = "That is the bound for n = 4. Halve it once more."; return, end
            if ~near(v, 1/32), m = "Not quite. Use (b − a)/2<sup>n</sup> with n = 5."; return, end
            r = "done";
            m = "Correct! After 5 steps the midpoint is within 1/32 = 0.03125 of the root.";
        end
    end

    function S = taskIterations()
        g = gridOf(work, {30, 50, 40, 40, '1x'}, {190, 150, '1x'});
        W.nLbl = uilabel(g, 'FontSize', 15, 'Interpreter', 'html'); W.nLbl.Layout.Column = [1 3];
        W.sn = uislider(g, 'Limits', [0 20], 'MajorTicks', 0:4:20, 'Value', 4, 'Tag', 'sn', 'FontSize', 13);
        W.sn.Layout.Column = [1 3];
        W.sn.ValueChangingFcn = @(~, e) moveMarker(round(e.Value));
        W.sn.ValueChangedFcn  = @(s, ~) moveMarker(snapInt(s));
        W.ni = numRow(g, 3, 'Smallest n =', 'ans1');

        n = 0:20;
        cla(ax); ax.YScale = 'log';
        semilogy(ax, n, 1 ./ 2.^n, 'o-', 'Color', C.curve, 'MarkerFaceColor', C.curve, 'LineWidth', 1.5);
        hold(ax, 'on');
        yline(ax, 1e-4, '-', 'ε = 10^{-4}', 'Color', C.red, 'LineWidth', 2, 'FontSize', 14);
        W.mark = semilogy(ax, 4, 1 / 16, 'o', 'MarkerSize', 16, 'LineWidth', 2.5, 'MarkerEdgeColor', C.gold);
        xlabel(ax, 'n'); ylabel(ax, 'error bound  1/2^n');
        title(ax, 'Error bound on [1, 2] (log scale)', 'FontSize', 15);
        ylim(ax, [1e-7 2]);

        S.html = ['To guarantee an error at most ε we need <b>(b − a)/2<sup>n</sup> ≤ ε</b>, ' ...
                  'i.e. n ≥ log<sub>2</sub>((b − a)/ε).<br><br>On [1, 2] with <b>ε = 10<sup>−4</sup></b>, ' ...
                  'what is the smallest number of iterations n?  Use the slider or the formula.'];
        S.hints = {'Move the slider until the gold circle first drops below the red line.', ...
                   sprintf('log<sub>2</sub>(10<sup>4</sup>) = %.2f, and n must be a whole number.', log2(1e4))};
        S.answer = 'n = 14, because 1/2<sup>13</sup> ≈ 1.2×10<sup>−4</sup> is too big and 1/2<sup>14</sup> ≈ 6.1×10<sup>−5</sup> ≤ 10<sup>−4</sup>.';
        S.check = @check;
        moveMarker(4);

        function moveMarker(k)
            set(W.mark, 'XData', k, 'YData', 1 / 2^k);
            ok = 1 / 2^k <= 1e-4;
            W.nLbl.Text = sprintf('n = %d:&nbsp; bound = %.2e &nbsp;<span style="color:%s"><b>%s</b></span>', ...
                                  k, 1 / 2^k, hex(pick(1 + ok, [C.red; C.green])), pick(1 + ok, ["too big", "≤ ε ✔"]));
        end

        function [r, m] = check()
            r = "wrong";
            v = getNum(W.ni);
            if isnan(v), m = "Type a whole number."; return, end
            if v == 13, m = "Close! 1/2<sup>13</sup> ≈ 1.22×10<sup>−4</sup> is still bigger than ε."; return, end
            if v > 14 && v == round(v), m = "That works, but it is not the smallest n."; return, end
            if v ~= 14, m = "Not quite. Find where the bound first drops below the red line."; return, end
            r = "done";
            m = "Correct! 14 iterations guarantee an error of at most 10<sup>−4</sup>.";
        end
    end

    function S = taskTouching()
        g = gridOf(work, {'1x'}, {'1x', '1x'});
        names = ["x³ − 1", "(x − 1)²", "x − 1", "cos(x) − 0.5"];
        fs = {@(x) x.^3 - 1, @(x) (x - 1).^2, @(x) x - 1, @(x) cos(x) - 0.5};
        cols = [C.curve; C.red; C.green; C.orange];
        optionCards(g, names, cols);
        for k = 1:4
            fplot(ax, fs{k}, [0 2], 'LineWidth', 2.5, 'Color', cols(k, :), 'DisplayName', names(k));
        end
        legend(ax, 'Location', 'northwest', 'FontSize', 13);
        ylim(ax, [-1.5 2]); title(ax, 'Four functions, each with a root in [0, 2]', 'FontSize', 15);

        S.html = ['Each function below has a root in [0, 2].<br><br>' ...
                  'Which one can bisection <b>NOT</b> find, starting from [0, 2]?'];
        S.hints = {'Check the sign of each function at x = 0 and at x = 2.', ...
                   'Look for a curve that touches the axis without crossing it.'};
        S.answer = '(x − 1)². It is positive at both ends and only touches the axis at x = 1, so there is no sign change.';
        S.check = @check;

        function [r, m] = check()
            r = "wrong";
            if choice == 0, m = "Choose one of the functions."; return, end
            if choice ~= 2
                m = sprintf('%s changes sign on [0, 2], so bisection can find its root.', names(choice)); return
            end
            r = "done";
            m = "Right! (x − 1)² touches the axis without changing sign, so bisection has nothing to grab.";
        end
    end

    function S = taskAlgorithm()
        steps = ["Choose a, b with f(a)·f(b) < 0", "Compute the midpoint c = (a + b)/2", ...
                 "If f(a)·f(c) < 0 set b = c, otherwise set a = c", "If (b − a)/2 < tol stop, otherwise repeat"];
        order = [3 1 4 2];
        items = ["— choose —", steps(order)];
        g = gridOf(work, {44, 44, 44, 44, '1x'}, {70, '1x'});
        W.dd = gobjects(1, 4);
        for k = 1:4
            l = uilabel(g, 'Text', sprintf('Step %d', k), 'FontSize', 15, 'FontWeight', 'bold');
            l.Layout.Row = k; l.Layout.Column = 1;
            W.dd(k) = uidropdown(g, 'Items', items, 'FontSize', 14, 'Tag', sprintf('dd%d', k));
            W.dd(k).Layout.Row = k; W.dd(k).Layout.Column = 2;
        end
        drawBracket(1, 2, [0.9 2.1]);
        title(ax, 'f(x) = x^3 - x - 2 on [1, 2]', 'FontSize', 15);

        S.html = ['Put the steps of the bisection method in the right order, using the drop-down menus.<br><br>' ...
                  'When you get it right, the plot runs the algorithm for you.'];
        S.hints = {'You must have a valid starting interval before anything else.', ...
                   'Compute c, use it to shrink the interval, then decide whether to stop.'};
        S.answer = strjoin(compose("%d. %s", (1:4)', steps'), '<br>');
        S.check = @check;

        function [r, m] = check()
            r = "wrong";
            picked = string({W.dd.Value});
            if any(picked == items(1)), m = "Choose an option for every step."; return, end
            if numel(unique(picked)) < 4, m = "Each option should be used exactly once."; return, end
            wrong = find(picked ~= steps, 1);
            if ~isempty(wrong), m = sprintf('Step %d is not in the right place yet.', wrong); return, end
            r = "done";
            m = "Perfect order! Watch the algorithm run on the plot.";
            feedback('ok', m);
            a = 1; b = 2;
            for n = 1:8
                c = (a + b) / 2;
                if f(a) * f(c) < 0, b = c; else, a = c; end
                drawBracket(a, b, [0.9 2.1]);
                title(ax, sprintf('Iteration %d:  [a, b] = [%.5f, %.5f]', n, a, b), 'FontSize', 15);
                drawnow; pause(0.35);
            end
        end
    end

% =====================================================================
%                                HELPERS
% =====================================================================

    function resetAxes()
        cla(ax, 'reset');
        legend(ax, 'off');
        hold(ax, 'on'); grid(ax, 'on'); box(ax, 'on');
        ax.FontSize = 13; ax.XLabel.String = 'x'; ax.YLabel.String = '';
        yline(ax, 0, 'k-', 'LineWidth', 1, 'HandleVisibility', 'off');
    end

    function drawBracket(a, b, xr)
        cla(ax); hold(ax, 'on');
        yline(ax, 0, 'k-', 'LineWidth', 1, 'HandleVisibility', 'off');
        fplot(ax, f, xr, 'LineWidth', 2.5, 'Color', C.curve);
        plot(ax, [a b], [0 0], '-', 'Color', C.gold, 'LineWidth', 8);
        for x = [a b]
            plot(ax, [x x], [0 f(x)], '--', 'Color', signColor(f(x)), 'LineWidth', 1.5);
            plot(ax, x, f(x), 'o', 'MarkerSize', 11, 'MarkerFaceColor', signColor(f(x)), 'MarkerEdgeColor', 'none');
        end
        if b - a > 0.04 * diff(xr)
            text(ax, a, -0.45, 'a', 'FontSize', 15, 'FontWeight', 'bold', 'HorizontalAlignment', 'center');
            text(ax, b, -0.45, 'b', 'FontSize', 15, 'FontWeight', 'bold', 'HorizontalAlignment', 'center');
        end
        xlim(ax, xr); ylim(ax, [-3 5]);
    end

    function g = gridOf(parent, rows, cols)
        g = uigridlayout(parent, [numel(rows) numel(cols)], 'RowHeight', rows, 'ColumnWidth', cols, ...
                         'Padding', 0, 'RowSpacing', 8, 'ColumnSpacing', 10, 'BackgroundColor', C.white);
    end

    function fld = numRow(g, row, label, tag)
        l = uilabel(g, 'Text', label, 'FontSize', 15, 'HorizontalAlignment', 'right');
        l.Layout.Row = row; l.Layout.Column = 1;
        fld = uieditfield(g, 'text', 'FontSize', 15, 'Tag', tag, 'Placeholder', 'type a number');
        fld.Layout.Row = row; fld.Layout.Column = 2;
    end

    function optionCards(g, texts, accents)
        % Clickable answer cards laid out in grid g (one per cell, row-major).
        n = numel(texts);
        if numel(g.RowHeight) * numel(g.ColumnWidth) < n
            g.RowHeight = repmat({'1x'}, 1, ceil(n / numel(g.ColumnWidth)));
        end
        cards = gobjects(1, n);
        for k = 1:n
            cards(k) = uibutton(g, 'Text', texts(k), 'WordWrap', onoff(strlength(texts(k)) > 26), 'FontSize', 15, ...
                                'BackgroundColor', C.card, 'Tag', sprintf('opt%d', k), ...
                                'ButtonPushedFcn', @(~, ~) select(k));
            if nargin > 2, cards(k).FontColor = accents(k, :); cards(k).FontWeight = 'bold'; end
        end
        function select(k)
            choice = k;
            set(cards, 'BackgroundColor', C.card);
            cards(k).BackgroundColor = C.cardSel;
        end
    end

    function v = getNum(fld)
        % Accept plain numbers or simple arithmetic such as 1/32 or 2^-5 (nothing else is evaluated).
        str = strtrim(fld.Value);
        v = str2double(str);
        if isnan(v) && ~isempty(str) && all(ismember(str, '0123456789.+-*/^()eE '))
            try
                v = str2num(str); %#ok<ST2NM> input is restricted to arithmetic characters above
            catch
                v = NaN;
            end
        end
        if ~(isnumeric(v) && isscalar(v) && isfinite(v)), v = NaN; end
    end

    function k = snapInt(s)
        k = round(s.Value);
        s.Value = k;
    end

    function tf = near(v, target)
        tf = ~isnan(v) && abs(v - target) <= 1e-6 * max(1, abs(target));
    end

    function c = signColor(v)
        if v > 0, c = C.pos; else, c = C.neg; end
    end

    function s = signed(v)
        if v > 0
            s = sprintf('<span style="color:%s">%.3f (positive)</span>', hex(C.pos), v);
        elseif v < 0
            s = sprintf('<span style="color:%s">%.3f (negative)</span>', hex(C.neg), v);
        else
            s = '0 (a root!)';
        end
    end

    function v = snap(v)
        v = round(v * 20) / 20;
    end
end

% ---------------- local functions (no shared state) ----------------

function h = hex(c)
    h = sprintf('#%02X%02X%02X', round(255 * c));
end

function out = pick(i, options)
    if isstring(options) || iscell(options)
        out = options(i);
    else
        out = options(i, :);
    end
end

function s = onoff(tf)
    if tf, s = 'on'; else, s = 'off'; end
end

function c = interp(c1, c2, t)
    c = c1 + (c2 - c1) * min(max(t, 0), 1);
end
