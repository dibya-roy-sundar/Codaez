const calcAggregateRating = (user) => {
    let n = 0, sum = 0, aggregateRating = 0;

    min_ratings = { lc: 1000, cf: 800, cc: 800 }
    max_ratings = { lc: 3200, cf: 3000, cc: 3000 }

    if (user?.lc?.rating && user.lc.rating>0) {
        sum += (user.lc.rating - min_ratings.lc) / (max_ratings.lc - min_ratings.lc)
        n++;
    }
    if (user?.cf?.rating && user.cf.rating>0) {
        sum += (user.cf.rating - min_ratings.cf) / (max_ratings.cf - min_ratings.cf)
        n++;
    }
    if (user?.cc?.rating && user.cc.rating>0) {
        sum += (user.cc.rating - min_ratings.cc) / (max_ratings.cc - min_ratings.cc)
        n++;
    }
    if (n > 0) {
        aggregateRating = Math.round(sum / n * 5000);
    }
    console.log("aggregate",sum,n,aggregateRating)

    return aggregateRating
}

module.exports = calcAggregateRating