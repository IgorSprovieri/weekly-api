class CommonErrors {
  forbidden({ res, nameInLowerCase }) {
    return res.status(403).json({
      error: `This ${nameInLowerCase} does not belong to this user`,
    });
  }

  notFound({ res, nameInLowerCase }) {
    const capitalizedName =
      nameInLowerCase.charAt(0).toUpperCase() + nameInLowerCase.slice(1);

    return res.status(404).json({ error: `${capitalizedName} not found` });
  }

  internalServerError({ res }) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = new CommonErrors();
