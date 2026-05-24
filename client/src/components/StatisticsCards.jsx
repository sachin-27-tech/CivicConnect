function StatisticsCards({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </div>
  );
}

export default StatisticsCards;
