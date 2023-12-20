const createTokenUser = (user) => {
  const { name, role, _id: userId } = user
  return {
    name,
    role,
    userId,
  }
}

module.exports = createTokenUser
