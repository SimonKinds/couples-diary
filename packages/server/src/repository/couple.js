class CoupleRepository {
  couples = [];

  createCouple = couple => {
    this.couples.push(couple);
    return couple;
  };
  getCouples = () => this.couples;
  updateCouple = couple => {
    const index = this.couples.findIndex(({ id }) => couple.id === id);

    if (index === -1) {
      return null;
    }

    this.couples[index] = couple;
    return couple;
  };
}

export const createCoupleRepository = () => new CoupleRepository();
