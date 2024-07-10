const calcAggregateRating = (user) => {
    let n = 0, sum = 0, aggregateRating = 0;

    min_ratings = { lc: 1200, cf: 800, cc: 800 }
    max_ratings = { lc: 3000, cf: 2700, cc: 2700 }

    if (user?.lc?.rating > 0) {
        sum += (user.lc.rating - min_ratings.lc) / (max_ratings.lc - min_ratings.lc)
        n++;
    }
    if (user?.cf?.rating > 0) {
        sum += (user.cf.rating - min_ratings.cf) / (max_ratings.cf - min_ratings.cf)
        n++;
    }
    if (user?.cc?.rating > 0) {
        sum += (user.cc.rating - min_ratings.cc) / (max_ratings.cc - min_ratings.cc)
        n++;
    }
    if (n > 0) {
        aggregateRating = Math.round(sum / n * 10000);
    }

    return aggregateRating
}

module.exports = calcAggregateRating