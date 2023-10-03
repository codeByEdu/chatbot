import openai
  
api_key = "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"

openai.api_key = api_key

with open("dataset.jsonl", encoding="utf-8") as file:
  response = openai.File.create(
    file=file,
    purpose='fine-tune'
  )

file_id = response['id']
print(f"ID: {file_id}")

#Usando o File ID
file_id =  file_id
model_name = "ft:gpt-3.5-turbo-0613:personal::85Rh26i6" #Fine-Tuned model

response = openai.FineTuningJob.create(
  training_file=file_id,
  model=model_name
)

job_id = response['id']
print(f"job id={job_id}")