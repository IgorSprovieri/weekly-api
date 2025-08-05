import { Response } from "express";

type ForbiddenDto = {
  res: Response;
  nameInLowerCase: string;
};

type NotFoundDto = {
  res: Response;
  nameInLowerCase: string;
};

type InternalServerErrorDto = { res: Response };

class CommonErrors {
  forbidden({ res, nameInLowerCase }: ForbiddenDto) {
    return res.status(403).json({
      error: `This ${nameInLowerCase} does not belong to this user`,
    });
  }

  notFound({ res, nameInLowerCase }: NotFoundDto) {
    const capitalizedName =
      nameInLowerCase.charAt(0).toUpperCase() + nameInLowerCase.slice(1);

    return res.status(404).json({ error: `${capitalizedName} not found` });
  }

  internalServerError({ res }: InternalServerErrorDto) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const commonErrors = new CommonErrors();
