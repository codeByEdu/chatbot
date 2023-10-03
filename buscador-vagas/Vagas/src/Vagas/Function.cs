using Amazon.Lambda.Core;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Vagas.Models;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Vagas
{
    public class Function
    {

        public static List<VAGA> FunctionHandler(string id, ILambdaContext context)
        {
            Console.WriteLine("Log: Start Connection");

            //string configDB = Environment.GetEnvironmentVariable("DB_CONN");
            string configDB = "Server=aws-us-east-2.connect.psdb.cloud;Database=hackathon;user=hflzfr8eh0pcntx8zu7r;password=pscale_pw_qZmyuPsMWsQbMnGbdJj2xXmrCc3gTJDXR4THyZ2XPao;SslMode=VerifyFull";

            using (var _connection = new MySqlConnection(configDB))
            {

                if (_connection.State == ConnectionState.Closed)
                    _connection.Open();

                var cmd = new MySqlCommand($"SELECT * FROM VAGAS WHERE ID_CURSO= @ID AND STATUS = 1", _connection);
                cmd.Parameters.AddWithValue("@ID", Int32.Parse(id));

                using (cmd)
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        List<VAGA> vagas = new List<VAGA>();
                        while (reader.Read())
                        {
                            vagas.Add(new VAGA()
                            {
                                ID_VAGA = Convert.ToInt32(reader["ID_VAGA"]),
                                NOME = reader["NOME"].ToString(),
                                LINK = reader["LINK"].ToString(),
                                COD_VAGA = Convert.ToInt32(reader["COD_VAGA"]),
                            });
                        }

                        return vagas;
                    }
                }

            }
        }

    }


}