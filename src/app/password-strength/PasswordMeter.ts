interface Matches {
    pos: Record<string, any>,
    neg: Record<string, any>
}

export class DetailsRow {
    key: string = "";
    description: string = "";
    type: string = "";
    rate: string = "";
    count: number = 0;
    bonus: number = 0;
    minRequired: number = 1;
    isPositive: boolean = true;

    constructor(key: string, description: string, type: string,
        rate: string, minRequired: number = 1, isPositive: boolean = true) {
        this.key = key;
        this.description = description;
        this.type = type;
        this.rate = rate;
        this.count = 0;
        this.bonus = 0;
        this.minRequired = minRequired;
        this.isPositive = isPositive;
    }

    getLegend(): string {
        if (this.isPositive) {
            if (this.count == this.minRequired) return "Sufficient";
            if (this.count > this.minRequired) return "Exceptional";
            return "Failure";
        } else {
            if (this.count == this.minRequired) return "Sufficient";
            return "Warning";
        }
    }

    // gpp_good, workspace_premium, sentiment_very_satisfied
    // thumb_up_alt, check
    // error, error_outline, notification_important
    // dangerous, cancel, sentiment_very_dissatisfied
    getLegendIcon(): string {
        if (this.isPositive) {
            if (this.count == this.minRequired) return "thumb_up_alt";
            if (this.count > this.minRequired) return "gpp_good"; // sentiment_very_satisfied 
            return "dangerous";
        } else {
            if (this.count == this.minRequired) return "thumb_up_alt";
            return "error";
        }
    }

}

const PosDetailsRow: DetailsRow[] = [
    // positive
    new DetailsRow("numChars", "Number of Characters", "Flat", "+(n*4)", 10),
    new DetailsRow("upper", "Uppercase Letters", "Cond/Incr", "+((len-n)*2)"),
    new DetailsRow("lower", "Lowercase Letters", "Cond/Incr", "+((len-n)*2)"),
    new DetailsRow("numbers", "Numbers", "Cond", "+(n*4)"),
    new DetailsRow("symbols", "Symbols", "Flat", "+(n*6)"),
    new DetailsRow("middleSymbol", "Middle Symbols", "Flat", "+(n*2)"),
    new DetailsRow("middleNumber", "Middle Numbers", "Flat", "+(n*2)"),
    new DetailsRow("requirements", "Requirements", "Flat", "+(n*2)", 4),
    // negative
    new DetailsRow("onlyLetters", "Letters Only", "Flat", "-n", 0, false),
    new DetailsRow("onlyNumbers", "Numbers Only", "Flat", "-n", 0, false),
    new DetailsRow("repeated", "Repeat Characters (Case Insensitive)", "Flat", '10*len/(len-n/1.4)', 0, false),
    new DetailsRow("consecUpper", "Consecutive Uppercase Letters", "Flat", "-(n*2)", 0, false),
    new DetailsRow("consecLower", "Consecutive Lowercase Letters", "Flat", "-(n*2)", 0, false),
    new DetailsRow("consecNumbers", "Consecutive Numbers", "Flat", "-(n*2)", 0, false),
    new DetailsRow("seqLetter", "	Sequential Letters (3+)", "Flat", "-(n*3)", 0, false),
    new DetailsRow("seqNumber", "Sequential Numbers (3+)", "Flat", "-(n*3)", 0, false),
    new DetailsRow("seqSymbol", "Sequential Symbols (3+)", "Flat", "-(n*3)", 0, false),
    new DetailsRow("blackList", "Black list", "Comp", "finalScore/2", 0, false),

];

export class PasswordMeter {
    //danital456danital456!A
    private password: string = "";
    private matches: Matches = { pos: {}, neg: {} };
    private counts: Matches = { pos: {}, neg: {} };
    private rowDetailes: DetailsRow[] = PosDetailsRow.filter(x => true);
    private score: number = 0;
    private blackList: string[] = [];

    private static readonly letters = 'abcdefghijklmnopqrstuvwxyz';
    private static readonly numbers = '01234567890';
    private static readonly symbols = '\\!@#$%&/()=?¿';
    static readonly minPasswordScoreRequired = 70;

    public setPassword(pwd: string): void {
        this.password = pwd;
        this.score = 0;
        this.matches = { pos: {}, neg: {} };
        this.counts = { pos: {}, neg: {} };
        this.counts.neg.seqLetter = 0;
        this.counts.neg.seqNumber = 0;
        this.counts.neg.seqSymbol = 0;
        this.resetRowsDetails();
    }

    public updateUserDetails(firstName: string, lastName: string, username: string, email: string): void {
        this.blackList = ['password', '1234'];
        if (firstName.length > 3) {
            this.blackList.push(firstName.substring(0, 3));
            this.blackList.push(firstName.substring(firstName.length - 3));
        }
        if (lastName.length > 3) {
            this.blackList.push(lastName.substring(0, 3));
            this.blackList.push(lastName.substring(lastName.length - 3));
        }
        if (username.length > 3) {
            this.blackList.push(username.substring(0, 3));
            this.blackList.push(username.substring(username.length - 3));
        }
        if (email.length > 3)
            this.blackList.push(email.substring(0, 3));

        // console.log('this.blackList =', this.blackList);
    }

    public getPasswordScore(): number {
        // this.setPassword(this.password);
        this.calcMatchesAndCounts();
        this.calcRowDetailsTable();
        this.calcScore();
        return this.score;
    }

    public getComplexity(): string {
        if (this.password.length < 10) return 'Too Short';
        if (this.score < 20) return 'Very Weak';
        if (this.score < 50) return 'Weak';
        if (this.score < 65) return 'Good';
        if (this.score < 85) return 'Strong';
        return 'Very Strong';
    }

    public getPasswordRequirements(): number {
        return this.counts.pos.requirements;
    }

    public getStrengthDetails(): DetailsRow[] {
        return this.rowDetailes;
    }

    private addDetailsRow(
        id: number,
        description: string,
        type: string,
        rate: string,
        count: number,
        bouns: number): any { }


    private stringReverse = function (str: string) {
        for (var i = str.length - 1, out = ''; i >= 0; out += str[i--]) { }
        return out;
    };

    private calcMatchesAndCounts(): void {
        if (!this.password) return;

        const p = this.password;
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '01234567890';
        const symbols = '\\!@#$%&/()=?¿';
        let tmp, back, forth, i;

        // Benefits
        this.matches.pos.lower = p.match(/[a-z]/g);
        this.matches.pos.upper = p.match(/[A-Z]/g);
        this.matches.pos.numbers = p.match(/\d/g);
        this.matches.pos.symbols = p.match(/[$-/:-?{-~!^_`\[\]]/g);
        this.matches.pos.middleNumber = p.slice(1, -1).match(/\d/g);
        this.matches.pos.middleSymbol = p.slice(1, -1).match(/[$-/:-?{-~!^_`\[\]]/g);

        this.counts.pos.lower = this.matches.pos.lower ? this.matches.pos.lower.length : 0;
        this.counts.pos.upper = this.matches.pos.upper ? this.matches.pos.upper.length : 0;
        this.counts.pos.numbers = this.matches.pos.numbers ? this.matches.pos.numbers.length : 0;
        this.counts.pos.symbols = this.matches.pos.symbols ? this.matches.pos.symbols.length : 0;

        const item = this.counts;
        tmp = Object.keys(item.pos).reduce(function (previous, key) {
            return previous + Math.min(1, item.pos[key]);
        }, 0);

        this.counts.pos.numChars = p.length;
        tmp += (this.counts.pos.numChars >= 10) ? 1 : 0;

        this.counts.pos.requirements = tmp;
        this.counts.pos.middleNumber = this.matches.pos.middleNumber ? this.matches.pos.middleNumber.length : 0;
        this.counts.pos.middleSymbol = this.matches.pos.middleSymbol ? this.matches.pos.middleSymbol.length : 0;

        // Deductions
        this.matches.neg.consecLower = p.match(/(?=([a-z]{2}))/g);
        this.matches.neg.consecUpper = p.match(/(?=([A-Z]{2}))/g);
        this.matches.neg.consecNumbers = p.match(/(?=(\d{2}))/g);
        this.matches.neg.onlyNumbers = p.match(/^[0-9]*$/g);
        this.matches.neg.onlyLetters = p.match(/^([a-z]|[A-Z])*$/g);

        this.counts.neg.consecLower = this.matches.neg.consecLower ? this.matches.neg.consecLower.length : 0;
        this.counts.neg.consecUpper = this.matches.neg.consecUpper ? this.matches.neg.consecUpper.length : 0;
        this.counts.neg.consecNumbers = this.matches.neg.consecNumbers ? this.matches.neg.consecNumbers.length : 0;

        // sequential letters (back and forth)
        for (i = 0; i < letters.length - 2; i++) {
            var p2 = p.toLowerCase();
            forth = letters.substring(i, (i + 3));
            back = this.stringReverse(forth);
            if (p2.indexOf(forth) !== -1 || p2.indexOf(back) !== -1) {
                this.counts.neg.seqLetter++;
            }
        }

        // sequential numbers (back and forth)
        for (i = 0; i < numbers.length - 2; i++) {
            forth = numbers.substring(i, (i + 3));
            back = this.stringReverse(forth);
            if (p.indexOf(forth) !== -1 || p.toLowerCase().indexOf(back) !== -1) {
                this.counts.neg.seqNumber++;
            }
        }

        // sequential symbols (back and forth)
        for (i = 0; i < symbols.length - 2; i++) {
            forth = symbols.substring(i, (i + 3));
            back = this.stringReverse(forth);
            if (p.indexOf(forth) !== -1 || p.toLowerCase().indexOf(back) !== -1) {
                this.counts.neg.seqSymbol++;
            }
        }

        var repeats: Record<string, any> = {};
        var _p = p.toLowerCase();
        var arr = _p.split('');
        this.counts.neg.repeated = 0;
        let tav = '';
        for (i = 0; i < arr.length; i++) {
            tav = "[" + _p[i] + "]";
            var _reg = new RegExp(tav, 'g');
            var cnt = (_p.match(_reg) || "").length;
            if (cnt > 1 && !repeats[tav]) {
                repeats[tav] = cnt;
                this.counts.neg.repeated += cnt;
            }
        }
        // let nRepChar = repeats.getke;
        // let nUnqChar = arr.length - nRepChar;
        // let nRepInc = (!nUnqChar || nRepChar >= nUnqChar)?(3):(1);
        // this.counts.neg.repeated = this.counts.neg.repeated*nRepInc;
        // let rep = (arr.length)/(arr.length+1-nRepChar);

        this.counts.neg.onlyNumbers = this.matches.neg.onlyNumbers ? 1 : 0;
        this.counts.neg.onlyLetters = this.matches.neg.onlyLetters ? 1 : 0;

        this.counts.neg.blackList = 0;
        this.blackList.forEach(item => {
            if (p.indexOf(item) > -1)
                this.counts.neg.blackList++;
        });
    }

    private resetRowsDetails(): void {
        this.rowDetailes.forEach(x => {
            x.count = 0;
            x.bonus = 0;
        });
    }

    private updateRowDetailsBonus(key: string, bonus: number): void {
        const row = this.rowDetailes.find(x => x.key == key);
        row!.bonus = Math.round(bonus);
    }

    private updateRowsDetailsCount(): void {
        this.rowDetailes.forEach(x => {
            if (x.isPositive) x.count = this.counts.pos[x.key];
            else x.count = this.counts.neg[x.key];
        });
    }

    private calcRowDetailsTable(): void {
        // Calculations
        if (!this.password) return;

        this.updateRowsDetailsCount();

        let temp;

        this.updateRowDetailsBonus("numChars", this.counts.pos.numChars * 4);

        if (this.counts.pos.upper) {
            temp = (this.counts.pos.numChars - this.counts.pos.upper) * 2;
            this.updateRowDetailsBonus("upper", temp);
        }

        if (this.counts.pos.lower) {
            temp = (this.counts.pos.numChars - this.counts.pos.lower) * 2;
            this.updateRowDetailsBonus("lower", temp);
        }

        if (this.counts.pos.upper || this.counts.pos.lower) {
            this.updateRowDetailsBonus("numbers", this.counts.pos.numbers * 4);
        }

        this.updateRowDetailsBonus("symbols", this.counts.pos.symbols * 6);
        this.updateRowDetailsBonus("middleSymbol", this.counts.pos.middleSymbol * 2);
        this.updateRowDetailsBonus("middleNumber", this.counts.pos.middleNumber * 2);
        if (this.counts.pos.requirements >= 4 && this.counts.pos.numChars >= 10)
            this.updateRowDetailsBonus("requirements", this.counts.pos.requirements * 2);

        this.updateRowDetailsBonus("consecLower", -this.counts.neg.consecLower * 2);
        this.updateRowDetailsBonus("consecUpper", -this.counts.neg.consecUpper * 2);
        this.updateRowDetailsBonus("consecNumbers", -this.counts.neg.consecNumbers * 2);
        this.updateRowDetailsBonus("seqNumber", -this.counts.neg.seqNumber * 3);
        this.updateRowDetailsBonus("seqLetter", -this.counts.neg.seqLetter * 3);
        this.updateRowDetailsBonus("seqSymbol", -this.counts.neg.seqSymbol * 3);


        if (this.matches.neg.onlyNumbers) {
            this.updateRowDetailsBonus("onlyNumbers", -this.counts.pos.numChars);
        }
        if (this.matches.neg.onlyLetters) {
            this.updateRowDetailsBonus("onlyLetters", -this.counts.pos.numChars);
        }
        if (this.counts.neg.repeated) {
            temp = (this.counts.pos.numChars / (this.counts.pos.numChars - this.counts.neg.repeated / 1.4)) * 10;
            this.updateRowDetailsBonus("repeated", -temp);
        }
    }

    private calcScore(): void {
        let strength = 0;
        this.rowDetailes.forEach(row => {
            // strength += row.isPositive ? (row.bonus) : (-row.bonus);
            strength += row.bonus;
        });

        strength = Math.max(0, Math.min(100, Math.round(strength)));
        
        if (this.counts.neg.blackList > 0) {
            strength = strength / 2;
            this.updateRowDetailsBonus("blackList", -strength);
        }

        this.score = Math.round(strength);
    }

    private calcPasswordStrength2(): number {
        // Calculations
        let strength = 0;

        strength += this.counts.pos.numChars * 4;

        if (this.counts.pos.upper) {
            strength += (this.counts.pos.numChars - this.counts.pos.upper) * 2;
        }

        if (this.counts.pos.lower) {
            strength += (this.counts.pos.numChars - this.counts.pos.lower) * 2;
        }
        if (this.counts.pos.upper || this.counts.pos.lower) {
            strength += this.counts.pos.numbers * 4;
        }
        strength += this.counts.pos.symbols * 6;
        strength += (this.counts.pos.middleSymbol + this.counts.pos.middleNumber) * 2;
        strength += this.counts.pos.requirements * 2;

        strength -= this.counts.neg.consecLower * 2;
        strength -= this.counts.neg.consecUpper * 2;
        strength -= this.counts.neg.consecNumbers * 2;
        strength -= this.counts.neg.seqNumber * 3;
        strength -= this.counts.neg.seqLetter * 3;
        strength -= this.counts.neg.seqSymbol * 3;

        if (this.matches.neg.onlyNumbers) {
            strength -= this.counts.pos.numChars;
        }
        if (this.matches.neg.onlyLetters) {
            strength -= this.counts.pos.numChars;
        }
        if (this.counts.neg.repeated) {
            strength -= (this.counts.neg.repeated / this.counts.pos.numChars) * 10;
        }

        return Math.max(0, Math.min(100, Math.round(strength)));
    }

}