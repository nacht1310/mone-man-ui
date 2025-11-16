export const formatDisplayName = (name: string) => {
  const formattedName = name.replaceAll(/[A-Z]/g, ' $&').replaceAll('id', 'ID');
  return formattedName[0].toUpperCase() + formattedName.slice(1);
};
