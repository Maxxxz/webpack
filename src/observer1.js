class Subject {
  constructor() {
    this.obersvers = [];
    this.state = 0;
  }

  getStete() {
    return this.state;
  }

  setState(state) {
    this.state = state;
    this.notifyAllObservers();
  }

  attach(obersver) {
    this.obersvers.push(obersver);
  }

  notifyAllObservers() {
    this.obersvers.forEach(obersver => {
      obersver.update();
    });
  }
}

class Observer {
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attach(this);
  }

  update() {
    console.log(`${this.name} update, state: ${this.subject.getStete()}`);
  }
}

const sub = new Subject();
const o1 = new Observer('o1', sub);
const o2 = new Observer('o2', sub);
const o3 = new Observer('o3', sub);

sub.setState(1);
sub.setState(2);
