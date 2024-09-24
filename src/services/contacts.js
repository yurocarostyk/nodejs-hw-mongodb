import { SORT_ORDER } from '../constants/index.js';
import { contactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactsCollection.find({ userId }).merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: contactsCount,
    ...paginationData,
  };
};

export const getContactByID = async ({ contactId, userId }) => {
  const contact = await contactsCollection.findOne({ _id: contactId, userId });

  return contact;
};

export const createContact = async (payload) => {
  const newContact = await contactsCollection.create(payload);

  return newContact;
};

export const updateContact = async (
  userId,
  studentId,
  payload,
  options = {},
) => {
  const rawData = await contactsCollection.findOneAndUpdate(
    { _id: studentId, userId },
    payload,
    {
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawData || !rawData.value) return null;

  return {
    data: rawData.value,
  };
};

export const deleteContact = async ({ contactId, userId }) => {
  const deletedContact = await contactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return deletedContact;
};