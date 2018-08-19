class CoupleRepository {
  couples = [];

  createCouple = couple => {
    this.couples.push(couple);
    return Promise.resolve(couple);
  };
  getCouples = () => Promise.resolve(this.couples);
  updateCouple = couple => {
    const index = this.couples.findIndex(({ id }) => couple.id === id);

    if (index === -1) {
      return Promise.resolve(null);
    }

    this.couples[index] = couple;
    return Promise.resolve(couple);
  };
}

export const createCoupleRepository = () => new CoupleRepository();
