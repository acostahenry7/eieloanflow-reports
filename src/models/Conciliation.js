module.exports = (sequelize, Sequelize) => {
  const Conciliation = sequelize.define(
    "conciliation",
    {
      conciliation_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      description: {
        type: Sequelize.INTEGER,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.STRING,
      },
      created_date: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      last_modified_by: {
        type: Sequelize.STRING,
      },
      last_modified_date: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      outlet_id: {
        type: Sequelize.STRING,
      },
      status_type: {
        type: Sequelize.STRING,
      },
      outlet_id: {
        type: Sequelize.STRING,
      },
    },
    {
      schema: "public",
      underscored: true,
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Conciliation;
};
