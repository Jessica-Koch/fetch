const Dog = require('../models').Dog;

module.exports = {
  create(request, response) {
    return Dog.create({
      name: request.body.name,
      breed: request.body.breed,
      sex: request.body.sex,
      birthday: request.body.birthday,
      userId: request.params.userId
    })
      .then(dog => response.status(201).send(dog))
      .catch(error => response.status(400).send(error));
  },
  update(request, response) {
    return Dog.find({
      where: {
        id: request.params.dogId,
        userId: request.params.userId
      }
    })
      .then(dog => {
        if (!dog) {
          return response.status(404).send({
            message: 'Dog not found.'
          });
        }

        return dog
          .update(request.body, {fields: Object.keys(request.body)})
          .then(updatedDog => response.status(200).send(updatedDog))
          .catch(error => response.status(400).send(error));
      })
      .catch(error => response.status(400).send(error));
  },
  destroy(request, response) {
    return Dog.find({
      where: {
        id: request.params.dogId,
        userId: request.params.userId
      }
    })
      .then(dog => {
        if (!dog) {
          return response.status(404).send({
            message: 'Dog not found.'
          });
        }

        return dog
          .destroy()
          .then(() => response.status(204).send())
          .catch(error => response.status(400).send(error));
      })
      .catch(error => response.status(400).send(error));
  }
};
