import ApiRequest from "./baseRequest.js";
import { QUESTION_ENDPOINT } from "../helpers/urlHelper.js";

const _service = new ApiRequest();

export const getAllQuestions = async() => {
    const result = await _service.get(QUESTION_ENDPOINT)
    return await result.json()
}

export const insertQuestions = async data => {
    const result = await _service.insert(QUESTION_ENDPOINT, data)
    return await result.json()
}

export const deleteQuestions = async id => {
    const result = await _service.delete(QUESTION_ENDPOINT, id)
    return await result.json()
}

export const updateQuestions = async data => {
    const result = await _service.updatequestion(QUESTION_ENDPOINT,data.id,data.question)
    return await result.json()
}