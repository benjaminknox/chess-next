import { User } from '@types'
import { v4 as uuidv4 } from 'uuid'
import { uniqueNamesGenerator, names, starWars } from 'unique-names-generator'

export const generateRandomUser = (
  PassedInUser: Partial<User> = {}
): Partial<User> & any => {
  for (let key in PassedInUser) {
    if (PassedInUser[key as keyof User] === undefined) {
      delete PassedInUser[key as keyof User]
    }
  }
  return {
    id: uuidv4(),
    createdTimestamp: new Date(
      +new Date() - Math.floor(Math.random() * 10000000000)
    ).getTime(),
    username: uniqueNamesGenerator({
      dictionaries: [names],
      style: 'lowerCase',
    }),
    enabled: true,
    totp: false,
    emailVerified: true,
    firstName: uniqueNamesGenerator({
      dictionaries: [names],
    }),
    lastName: uniqueNamesGenerator({
      dictionaries: [names],
    }),
    email:
      uniqueNamesGenerator({
        dictionaries: [names],
        separator: '-',
        style: 'lowerCase',
      }) + '@example.com',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: false,
      view: true,
      mapRoles: false,
      impersonate: false,
      manage: false,
    },
    ...PassedInUser,
  }
}

export const generateUsersList = (): Partial<User>[] =>
  Array.from({ length: 15 }, (_, i) => generateRandomUser())
