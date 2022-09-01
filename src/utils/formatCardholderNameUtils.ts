export async function formatName(fullName: string) {
    let names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names[names.length - 1];
  
    names.shift();
    names.pop();
    let formattedNames = [];
  
    names.forEach((middleName, index) => {
      if (middleName.length > 3) {
        middleName = middleName.charAt(0).toUpperCase();
        formattedNames.push(middleName);
      }
    });
  
    return `${firstName} ${formattedNames.join(" ")} ${lastName}`;
}