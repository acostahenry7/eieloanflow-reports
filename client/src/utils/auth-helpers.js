function validateifUserHasAccess(neededRol, permissions) {
  const userPermissions = permissions?.split(",");
  const userHasAccess = userPermissions?.some((item) => item == neededRol);

  return userHasAccess;
}

export { validateifUserHasAccess };
